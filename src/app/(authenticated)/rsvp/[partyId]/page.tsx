"use client";

import {
    ActionIcon,
    Button,
    Card,
    Divider,
    Popover,
    Progress,
} from "@mantine/core";
import {
    CalendarBlankIcon,
    CheckCircleIcon,
    TrashIcon,
    UsersIcon,
} from "@phosphor-icons/react";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useMemo, useState } from "react";
import { CommentSection } from "@/components/CommentSection";
import { FullscreenLoader } from "@/components/FullscreenLoader";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { formatDate } from "@/lib/formatDate";
import { schema } from "~/zenstack/schema";

export default function RsvpPage({
    params,
}: {
    params: Promise<{ partyId: string }>;
}) {
    const { partyId } = use(params);
    const client = useClientQueries(schema);
    const { user } = useAuthenticatedContext();
    const [opened, setOpened] = useState(false);
    const router = useRouter();

    const {
        data: dinnerParty,
        isLoading,
        refetch: refetchDinnerParty,
    } = client.dinnerParty.useFindUnique({
        where: {
            id: Number(partyId),
        },
        include: {
            guests: true,
        },
    });

    const {
        data: guestCount,
        isLoading: guestCountLoading,
        refetch: refetchGuestCount,
    } = client.$procs.getGuestCount.useQuery({
        args: {
            partyId: dinnerParty?.id as number, // Should fail on undefined
        },
    });

    const {
        failureReason: rsvpFailureReason,
        mutateAsync: rsvp,
        isPending: rsvpPending,
    } = client.$procs.reserveSeat.useMutation();

    const {
        failureReason: unRsvpFailureReason,
        mutateAsync: unRsvp,
        isPending: unRsvpPending,
    } = client.$procs.unReserveSeat.useMutation();

    const { mutateAsync: deleteDinnerParty } = client.dinnerParty.useDelete();

    const reservedAlready = useMemo(
        () => dinnerParty?.guests.some((g) => g.userId === user.id),
        [dinnerParty, user],
    );

    const isFull = useMemo(
        () =>
            !!dinnerParty &&
            guestCount !== undefined &&
            guestCount >= dinnerParty.maxGuests,
        [dinnerParty, guestCount],
    );

    const onClick = useCallback(async () => {
        if (reservedAlready) {
            await unRsvp(
                {
                    args: {
                        partyId: Number(partyId),
                    },
                },
                {
                    onSuccess: async () => {
                        await refetchDinnerParty();
                        await refetchGuestCount();
                    },
                },
            );

            return;
        }

        await rsvp(
            {
                args: {
                    partyId: Number(partyId),
                },
            },
            {
                onSuccess: async () => {
                    await refetchDinnerParty();
                    await refetchGuestCount();
                },
            },
        );
    }, [
        partyId,
        rsvp,
        refetchGuestCount,
        reservedAlready,
        unRsvp,
        refetchDinnerParty,
    ]);

    if (isLoading || guestCountLoading) {
        return <FullscreenLoader />;
    }

    return (
        <div className="relative flex flex-col items-center gap-6">
            {!(dinnerParty && (guestCount !== undefined || null)) ? (
                "Party not found"
            ) : (
                <Card
                    withBorder
                    className="relative w-full sm:w-md md:w-xl p-6! sm:p-8! shadow-sm! flex flex-col items-center gap-4!"
                >
                    {user.role === "Admin" && (
                        <Popover
                            width={300}
                            trapFocus
                            position="bottom"
                            withArrow
                            shadow="md"
                            opened={opened}
                            onChange={setOpened}
                        >
                            <Popover.Target>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    className="absolute! top-2 right-2 opacity-50! hover:opacity-100!"
                                    size="sm"
                                    aria-label="Delete party"
                                    onClick={() => {
                                        setOpened(true);
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
                                            setOpened(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                            deleteDinnerParty({
                                                where: {
                                                    id: Number(partyId),
                                                },
                                            }).then(() => router.push("/"));
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </Popover.Dropdown>
                        </Popover>
                    )}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-3xl sm:text-4xl wrap-break-word">
                            {dinnerParty.title}
                        </h1>
                        <div className="flex items-center gap-2 text-base sm:text-2xl opacity-70">
                            <CalendarBlankIcon size={18} />
                            <span>{formatDate(dinnerParty.dateTime)}</span>
                        </div>
                    </div>

                    {dinnerParty.description && (
                        <>
                            <Divider className="w-full" />
                            <p className="text-lg sm:text-xl text-center wrap-break-word">
                                {dinnerParty.description}
                            </p>
                        </>
                    )}

                    <Divider className="w-full" />

                    <div className="flex flex-col gap-3 items-center w-full">
                        <div className="flex flex-col gap-2 items-center w-full max-w-64">
                            <div className="flex items-center gap-2 text-lg sm:text-xl">
                                <UsersIcon size={20} />
                                <span>
                                    Guests: {guestCount}/{dinnerParty.maxGuests}
                                </span>
                            </div>
                            <Progress
                                className="w-full"
                                value={
                                    ((guestCount ?? 0) /
                                        dinnerParty.maxGuests) *
                                    100
                                }
                                color={isFull ? "red" : "orange"}
                                size="md"
                                radius="xl"
                            />
                        </div>

                        <Button
                            className="text-xl! sm:text-2xl! w-60! mt-2"
                            variant="outline"
                            color={reservedAlready ? "red" : undefined}
                            fullWidth
                            loading={rsvpPending || unRsvpPending}
                            onClick={onClick}
                        >
                            {reservedAlready ? "Cancel Reservation" : "Rsvp"}
                        </Button>
                        {reservedAlready && (
                            <div className="flex items-center gap-2 text-lg sm:text-xl text-accent">
                                <CheckCircleIcon size={20} weight="fill" />
                                <p>You are attending this dinner party!</p>
                            </div>
                        )}
                        {rsvpFailureReason && (
                            <p className="text-warning text-center">
                                {(
                                    rsvpFailureReason as unknown as {
                                        info: { message: string };
                                    }
                                )?.info?.message ?? rsvpFailureReason.message}
                            </p>
                        )}
                        {unRsvpFailureReason && (
                            <p className="text-warning text-center">
                                {(
                                    unRsvpFailureReason as unknown as {
                                        info: { message: string };
                                    }
                                )?.info?.message ?? unRsvpFailureReason.message}
                            </p>
                        )}
                    </div>
                </Card>
            )}
            {dinnerParty && <CommentSection partyId={dinnerParty.id} />}
        </div>
    );
}
