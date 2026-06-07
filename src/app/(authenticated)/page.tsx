"use client";

import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { schema } from "~/zenstack/schema";

export default function Home() {
    const { user } = useAuthenticatedContext();
    const client = useClientQueries(schema);

    const { data } = client.user.useFindMany({
        select: {
            id: true,
        },
    });

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-7xl">James and Paul Dinner Parties</h1>
            <p className="text-4xl">home page</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
            <p>Ids: {data?.map((u) => u.id)}</p>
        </div>
    );
}
