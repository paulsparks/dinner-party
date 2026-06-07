"use client";

import { Button } from "@mantine/core";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useCallback } from "react";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { schema } from "~/zenstack/schema";

export default function Home() {
    const { user } = useAuthenticatedContext();
    const client = useClientQueries(schema);

    const { mutateAsync: createDinnerParty } = client.dinnerParty.useCreate();
    const { refetch: reserveSeat } = client.$procs.reserveSeat.useQuery(
        {
            args: {
                partyId: 2,
            },
        },
        {
            enabled: false,
            retry: false,
        },
    );

    const { data } = client.user.useFindMany({
        select: {
            id: true,
            role: true,
        },
    });

    const onClickCreateParty = useCallback(
        () =>
            createDinnerParty({
                data: {
                    dateTime: new Date(),
                    maxGuests: 2,
                },
            }),
        [createDinnerParty],
    );

    const onClickReserveSeat = useCallback(() => reserveSeat(), [reserveSeat]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-7xl">James and Paul Dinner Parties</h1>
            <p className="text-4xl">home page</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
            <p>Role: {data?.find((x) => x.id === user.id)?.role}</p>
            <p>Ids: {data?.map((u) => u.id)}</p>
            <Button variant="outline" onClick={onClickCreateParty}>
                Create Party
            </Button>
            <Button variant="outline" onClick={onClickReserveSeat}>
                Reserve Seat
            </Button>
        </div>
    );
}
