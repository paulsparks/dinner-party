"use client";

import { ActionIcon, Button, Popover } from "@mantine/core";
import { TrashIcon } from "@phosphor-icons/react";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useMemo, useState } from "react";
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
                <>
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
                                    variant="outline"
                                    color="red"
                                    className="absolute! top-0 right-0"
                                    size="lg"
                                    onClick={() => {
                                        setOpened(true);
                                    }}
                                >
                                    <TrashIcon size={18} />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown className="flex flex-col gap-2 w-44!">
                                <p>Are you sure?</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                            deleteDinnerParty({
                                                where: { id: Number(partyId) },
                                            }).then(() => router.push("/"));
                                        }}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setOpened(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Popover.Dropdown>
                        </Popover>
                    )}
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-4xl sm:text-5xl">
                            {formatDate(dinnerParty.dateTime)}
                        </h1>
                        <p className="text-lg px-4 sm:p-0 sm:w-xl md:w-2xl xl:w-5xl sm:text-2xl text-center">
                            {dinnerParty.description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-xl sm:text-3xl text-center">
                            Guests: {guestCount}/{dinnerParty.maxGuests}
                        </p>
                        <Button
                            className="text-xl! sm:text-2xl! w-60!"
                            variant="outline"
                            fullWidth
                            loading={rsvpPending || unRsvpPending}
                            onClick={onClick}
                        >
                            {reservedAlready ? "Cancel Reservation" : "Rsvp"}
                        </Button>
                        {reservedAlready && (
                            <p className="text-xl">
                                You are attending this dinner party!
                            </p>
                        )}
                        {rsvpFailureReason && (
                            <p className="text-warning">
                                {(
                                    rsvpFailureReason as unknown as {
                                        info: { message: string };
                                    }
                                )?.info?.message ?? rsvpFailureReason.message}
                            </p>
                        )}
                        {unRsvpFailureReason && (
                            <p className="text-warning">
                                {(
                                    unRsvpFailureReason as unknown as {
                                        info: { message: string };
                                    }
                                )?.info?.message ?? unRsvpFailureReason.message}
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
