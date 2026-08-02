"use client";

import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Card,
    CopyButton,
    Divider,
    Tooltip,
} from "@mantine/core";
import {
    CheckIcon,
    CopySimpleIcon,
    EnvelopeSimpleIcon,
    KeyIcon,
    PencilSimpleIcon,
    ShieldCheckIcon,
    SignOutIcon,
    TrashIcon,
} from "@phosphor-icons/react";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import Link from "next/link";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { schema } from "~/zenstack/schema";

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function ProfilePage() {
    const { user } = useAuthenticatedContext();
    const client = useClientQueries(schema);

    const { data: accessCodes } = client.accessCode.useFindMany();
    const { mutateAsync: createAccessCode, isPending: creatingCode } =
        client.accessCode.useCreate();
    const { mutateAsync: deleteAccessCode } = client.accessCode.useDelete();

    return (
        <div className="flex flex-col items-center gap-6">
            <Card
                withBorder
                className="relative w-full sm:w-md p-6 shadow-sm! flex flex-col items-center gap-3!"
            >
                <ActionIcon
                    className="absolute! top-4 right-4"
                    variant="outline"
                    size="lg"
                    component={Link}
                    href="/profile/edit"
                    aria-label="Edit Profile"
                >
                    <PencilSimpleIcon size={18} />
                </ActionIcon>

                <Avatar size={72} radius="xl" color="orange">
                    {initials(user.name)}
                </Avatar>

                <h1 className="text-2xl sm:text-3xl wrap-break-word text-center">
                    {user.name}
                </h1>

                {user.role === "Admin" && (
                    <Badge
                        variant="light"
                        color="orange"
                        leftSection={
                            <ShieldCheckIcon size={12} weight="fill" />
                        }
                    >
                        Admin
                    </Badge>
                )}

                <div className="flex items-center gap-2 text-base sm:text-lg opacity-70">
                    <EnvelopeSimpleIcon size={18} />
                    <span>{user.email}</span>
                </div>

                <Divider className="w-full my-2" />

                <Button
                    className="text-lg! sm:text-xl! w-60!"
                    variant="outline"
                    color="red"
                    component={Link}
                    href="/sign-out"
                    leftSection={<SignOutIcon size={18} />}
                >
                    Sign out
                </Button>
            </Card>

            {user.role === "Admin" && (
                <Card
                    withBorder
                    className="w-full sm:w-md p-6! sm:p-8! shadow-sm! flex flex-col items-center gap-3!"
                >
                    <div className="flex items-center gap-2 text-2xl sm:text-3xl">
                        <KeyIcon size={24} />
                        <h1>Access Codes</h1>
                    </div>
                    <p className="text-sm sm:text-base opacity-70 text-center">
                        Share a code with someone to let them join the site.
                    </p>

                    <Button
                        className="text-lg! sm:text-xl! w-60! mt-2 mb-2"
                        variant="outline"
                        loading={creatingCode}
                        onClick={() => createAccessCode({ data: {} })}
                    >
                        Create new code
                    </Button>

                    {accessCodes?.length ? (
                        <div className="flex flex-col gap-2 w-full max-w-64">
                            {accessCodes.map(({ code }) => (
                                <div
                                    key={code}
                                    className="flex flex-row gap-2 items-center justify-around rounded-sm border border-white/15 px-3 py-1.5"
                                >
                                    <p className="font-mono tracking-wide">
                                        {code}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <CopyButton value={code}>
                                            {({ copied, copy }) => (
                                                <Tooltip
                                                    label={
                                                        copied
                                                            ? "Copied"
                                                            : "Copy"
                                                    }
                                                    withArrow
                                                >
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color={
                                                            copied
                                                                ? "green"
                                                                : "gray"
                                                        }
                                                        size="sm"
                                                        aria-label="Copy code"
                                                        onClick={copy}
                                                    >
                                                        {copied ? (
                                                            <CheckIcon
                                                                size={12}
                                                            />
                                                        ) : (
                                                            <CopySimpleIcon
                                                                size={12}
                                                            />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            size="sm"
                                            aria-label="Delete code"
                                            onClick={() =>
                                                deleteAccessCode({
                                                    where: { code },
                                                })
                                            }
                                        >
                                            <TrashIcon size={12} />
                                        </ActionIcon>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm opacity-50">
                            No access codes yet.
                        </p>
                    )}
                </Card>
            )}
        </div>
    );
}
