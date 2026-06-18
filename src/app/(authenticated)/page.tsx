"use client";

import { Button, Card } from "@mantine/core";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import Link from "next/link";
import { FullscreenLoader } from "@/components/FullscreenLoader";
import { formatDate } from "@/lib/formatDate";
import { schema } from "~/zenstack/schema";

export default function Home() {
    const client = useClientQueries(schema);

    const { data: dinnerParties, isLoading } = client.dinnerParty.useFindMany();

    if (isLoading) {
        return <FullscreenLoader />;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {dinnerParties
                ?.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())
                .map((dinnerParty) => (
                    <Card
                        component={Link}
                        className="w-72 sm:w-96 p-4! shadow-sm!"
                        withBorder
                        key={dinnerParty.id}
                        href={`/rsvp/${dinnerParty.id}`}
                    >
                        <p className="mb-2 text-xl sm:text-3xl">
                            {formatDate(dinnerParty.dateTime)}
                        </p>

                        <p className="wrap-break-word">
                            {dinnerParty.description}
                        </p>

                        <Button
                            className="text-xl! sm:text-3xl!"
                            variant="outline"
                            fullWidth
                            mt="md"
                        >
                            Rsvp
                        </Button>
                    </Card>
                ))}
        </div>
    );
}
