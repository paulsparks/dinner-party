"use client";

import { Button, Card, Divider } from "@mantine/core";
import { CalendarBlankIcon } from "@phosphor-icons/react";
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
                ?.filter(
                    (dinnerParty) =>
                        dinnerParty.dateTime.getTime() >= Date.now(),
                )
                .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
                .map((dinnerParty) => (
                    <Card
                        className="w-72 sm:w-96 p-5! shadow-sm!"
                        withBorder
                        key={dinnerParty.id}
                    >
                        <p className="text-xl sm:text-2xl wrap-break-word">
                            {dinnerParty.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm sm:text-base opacity-70 mb-2">
                            <CalendarBlankIcon size={16} />
                            <span>{formatDate(dinnerParty.dateTime)}</span>
                        </div>

                        {dinnerParty.description && (
                            <>
                                <Divider className="mb-2" />
                                <p className="wrap-break-word">
                                    {dinnerParty.description}
                                </p>
                            </>
                        )}

                        <Button
                            component={Link}
                            href={`/rsvp/${dinnerParty.id}`}
                            className="text-md! sm:text-xl!"
                            variant="outline"
                            fullWidth
                            mt="md"
                        >
                            View Party
                        </Button>
                    </Card>
                ))}
        </div>
    );
}
