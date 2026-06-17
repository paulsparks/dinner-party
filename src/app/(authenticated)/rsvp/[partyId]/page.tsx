"use client";

import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { notFound } from "next/navigation";
import { use } from "react";
import { FullscreenLoader } from "@/components/FullscreenLoader";
import { schema } from "~/zenstack/schema";

export default function RsvpPage({
    params,
}: {
    params: Promise<{ partyId: string }>;
}) {
    const { partyId } = use(params);
    const client = useClientQueries(schema);

    const { data: dinnerParty, isLoading } = client.dinnerParty.useFindUnique({
        where: {
            id: Number(partyId),
        },
    });

    if (isLoading) {
        return <FullscreenLoader />;
    }

    if (!dinnerParty) {
        return notFound();
    }

    return dinnerParty.description;
}
