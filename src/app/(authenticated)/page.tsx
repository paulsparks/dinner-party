"use client";

import { Button, Card } from "@mantine/core";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import Link from "next/link";
import { schema } from "~/zenstack/schema";

export default function Home() {
    const client = useClientQueries(schema);

    const { data: dinnerParties } = client.dinnerParty.useFindMany();

    return (
        <div className="flex flex-col items-center gap-4">
            {dinnerParties?.map((dinnerParty) => (
                <Card
                    component={Link}
                    className="w-72 sm:w-96 p-4! shadow-sm!"
                    withBorder
                    key={dinnerParty.id}
                    href={`/rsvp/${dinnerParty.id}`}
                >
                    <p className="mb-2 text-xl sm:text-3xl">
                        {dinnerParty.dateTime.toLocaleDateString()}{" "}
                        {dinnerParty.dateTime
                            .toLocaleTimeString()
                            .replace("AM", "am")
                            .replace("PM", "pm")}
                    </p>

                    <p className="wrap-break-word">{dinnerParty.description}</p>

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
