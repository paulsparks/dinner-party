"use client";

import { ActionIcon, Button, Divider, Popover, Textarea } from "@mantine/core";
import {
    ArrowBendUpLeftIcon,
    ChatCircleTextIcon,
    TrashIcon,
} from "@phosphor-icons/react";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useCallback, useMemo, useState } from "react";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import type { Comment } from "~/zenstack/models";
import { schema } from "~/zenstack/schema";

type CommentNode = Comment & { replies: CommentNode[] };

function buildCommentTree(comments: Comment[]): CommentNode[] {
    const byId = new Map<number, CommentNode>();
    for (const comment of comments) {
        byId.set(comment.id, { ...comment, replies: [] });
    }

    const roots: CommentNode[] = [];
    for (const node of byId.values()) {
        const parent =
            node.parentId !== null ? byId.get(node.parentId) : undefined;
        if (parent) {
            parent.replies.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

function formatTimestamp(date: Date) {
    const dateStr = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
    const timeStr = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${dateStr}, ${timeStr.replace("AM", "am").replace("PM", "pm")}`;
}

function CommentItem({
    comment,
    partyId,
    depth,
}: {
    comment: CommentNode;
    partyId: number;
    depth: number;
}) {
    const client = useClientQueries(schema);
    const { user } = useAuthenticatedContext();
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [deleteOpened, setDeleteOpened] = useState(false);

    const { mutateAsync: createComment, isPending: replyPending } =
        client.comment.useCreate();
    const { mutateAsync: deleteComment } = client.comment.useDelete();

    const canDelete = comment.authorId === user.id || user.role === "Admin";

    const onReply = useCallback(() => {
        const trimmed = replyText.trim();
        if (!trimmed) {
            return;
        }

        createComment({
            data: {
                content: trimmed,
                partyId,
                parentId: comment.id,
                authorId: user.id,
                authorName: user.name,
            },
        }).then(() => {
            setReplyText("");
            setReplying(false);
        });
    }, [createComment, replyText, partyId, comment.id, user]);

    return (
        <div className={depth > 0 ? "ml-4 sm:ml-6" : ""}>
            <div className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-base opacity-70">
                        {comment.authorName} &middot;{" "}
                        {formatTimestamp(comment.createdAt)}
                    </p>
                    {canDelete && (
                        <Popover
                            width={220}
                            trapFocus
                            position="bottom"
                            withArrow
                            shadow="md"
                            opened={deleteOpened}
                            onChange={setDeleteOpened}
                        >
                            <Popover.Target>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    size="sm"
                                    className="opacity-50! hover:opacity-100!"
                                    aria-label="Delete comment"
                                    onClick={() => {
                                        setDeleteOpened(true);
                                    }}
                                >
                                    <TrashIcon size={14} />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown className="flex flex-col gap-2 w-48!">
                                <p>Are you sure?</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDeleteOpened(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                            deleteComment({
                                                where: { id: comment.id },
                                            });
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </Popover.Dropdown>
                        </Popover>
                    )}
                </div>
                <p className="wrap-break-word">{comment.content}</p>
                <button
                    type="button"
                    className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 w-fit"
                    onClick={() => setReplying((v) => !v)}
                >
                    <ArrowBendUpLeftIcon size={14} />
                    Reply
                </button>
                {replying && (
                    <div className="flex flex-col gap-2 mt-1">
                        <Textarea
                            autosize
                            minRows={2}
                            value={replyText}
                            onChange={(e) =>
                                setReplyText(e.currentTarget.value)
                            }
                            placeholder={`Reply to ${comment.authorName}`}
                        />
                        <div className="flex gap-2">
                            <Button
                                size="xs"
                                variant="outline"
                                loading={replyPending}
                                onClick={onReply}
                            >
                                Post Reply
                            </Button>
                            <Button
                                size="xs"
                                variant="subtle"
                                onClick={() => {
                                    setReplying(false);
                                    setReplyText("");
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {comment.replies.length > 0 && (
                <div className="flex flex-col border-l border-(--mantine-color-dark-4) pl-3 sm:pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            partyId={partyId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CommentSection({ partyId }: { partyId: number }) {
    const client = useClientQueries(schema);
    const { user } = useAuthenticatedContext();
    const [newComment, setNewComment] = useState("");

    const { data: comments, isLoading } = client.comment.useFindMany({
        where: { partyId },
        orderBy: { createdAt: "asc" },
    });

    const { mutateAsync: createComment, isPending } =
        client.comment.useCreate();

    const tree = useMemo(() => buildCommentTree(comments ?? []), [comments]);

    const onSubmit = useCallback(() => {
        const trimmed = newComment.trim();
        if (!trimmed) {
            return;
        }

        createComment({
            data: {
                content: trimmed,
                partyId,
                authorId: user.id,
                authorName: user.name,
            },
        }).then(() => setNewComment(""));
    }, [createComment, newComment, partyId, user]);

    return (
        <div className="w-full sm:w-md md:w-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xl sm:text-2xl">
                <ChatCircleTextIcon size={22} />
                <p>Comments</p>
            </div>
            <Divider className="w-full" />

            {isLoading ? (
                <p className="opacity-70">Loading comments...</p>
            ) : tree.length === 0 ? (
                <p className="opacity-70">No comments yet.</p>
            ) : (
                <div className="flex flex-col divide-y divide-(--mantine-color-dark-4)">
                    {tree.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            partyId={partyId}
                            depth={0}
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
                <Textarea
                    autosize
                    minRows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.currentTarget.value)}
                    placeholder="Add a comment..."
                />
                <Button
                    variant="outline"
                    loading={isPending}
                    onClick={onSubmit}
                    className="self-end"
                >
                    Post Comment
                </Button>
            </div>
        </div>
    );
}
