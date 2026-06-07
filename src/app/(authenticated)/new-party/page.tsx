"use client";

import { Button, Textarea, TextInput } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { z } from "zod";
import { schema } from "~/zenstack/schema";

function parseFormDate(dateStr: string): Date {
    const match = dateStr.match(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4}) (0?[1-9]|1[0-2]):([0-5]\d)(am|pm)$/i,
    );
    if (!match) throw new Error("Invalid date format");

    const [, month, day, year, rawHours, minutes, meridiem] = match as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
    ];

    let hours = parseInt(rawHours, 10);
    if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
    if (meridiem.toLowerCase() === "pm" && hours !== 12) hours += 12;

    return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        hours,
        parseInt(minutes, 10),
    );
}

const dinnerPartySchema = z.object({
    dateTime: z
        .string({ error: "Date is required." })
        .regex(
            /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4} (0?[1-9]|1[0-2]):[0-5]\d(am|pm)$/i,
            "Date must be in the format: mm/dd/yyyy 12:00pm",
        ),
    maxGuests: z.coerce
        .number({
            error: "Must be a number.",
        })
        .min(1, { error: "Max Guests is required" }),
    description: z.string().optional(),
});

type DinnerParty = z.infer<typeof dinnerPartySchema>;

export default function NewPartyPage() {
    const router = useRouter();
    const client = useClientQueries(schema);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const { mutateAsync: createDinnerParty } = client.dinnerParty.useCreate();

    const form = useForm<DinnerParty>({
        mode: "uncontrolled",
        validate: schemaResolver(dinnerPartySchema, { sync: true }),
    });

    const onSubmit = useCallback(
        (values: DinnerParty) => {
            setError(undefined);
            setLoading(true);

            return createDinnerParty(
                {
                    data: {
                        dateTime: parseFormDate(values.dateTime),
                        maxGuests: Number(values.maxGuests),
                        description: values.description,
                    },
                },
                {
                    onSuccess: () => {
                        setLoading(false);
                        router.push("/");
                    },
                    onError: (error) => {
                        setLoading(false);
                        setError(error.message);
                    },
                },
            );
        },
        [createDinnerParty, router],
    );

    return (
        <div className="flex flex-col items-center gap-6">
            <p className="text-4xl">New Dinner Party</p>
            <form
                onSubmit={form.onSubmit(onSubmit)}
                className="flex flex-col w-full sm:w-xs"
            >
                <TextInput
                    withAsterisk
                    label="Date (mm/dd/yyyy 12:00pm)"
                    placeholder="mm/dd/yyyy 12:00pm"
                    key={form.key("dateTime")}
                    {...form.getInputProps("dateTime")}
                />
                <TextInput
                    withAsterisk
                    label="Max Guests"
                    placeholder="Max Guests"
                    key={form.key("maxGuests")}
                    {...form.getInputProps("maxGuests")}
                />
                <Textarea
                    label="Description (Optional)"
                    placeholder="Description"
                    key={form.key("description")}
                    {...form.getInputProps("description")}
                />

                <div className="flex flex-col gap-2 mt-4">
                    <Button type="submit" variant="outline" loading={loading}>
                        Create Dinner Party
                    </Button>
                    {error && <p className="text-warning">{error}</p>}
                </div>
            </form>
        </div>
    );
}
