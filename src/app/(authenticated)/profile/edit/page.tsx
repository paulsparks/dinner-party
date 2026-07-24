"use client";

import { Button, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { updateUser } from "@/lib/auth-client";

interface FormValues {
    name: string;
}

export default function EditProfilePage() {
    const { user } = useAuthenticatedContext();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const form = useForm<FormValues>({
        mode: "uncontrolled",
        initialValues: {
            name: user.name,
        },
        validate: {
            name: isNotEmpty("Full Name is required."),
        },
    });

    const onSubmit = useCallback(
        (values: FormValues) => {
            setError(undefined);
            setLoading(true);

            return updateUser(
                { name: values.name },
                {
                    onSuccess: () => {
                        setLoading(false);
                        router.push("/profile");
                    },
                    onError: (ctx) => {
                        setLoading(false);
                        setError(ctx.error.message);
                    },
                },
            );
        },
        [router],
    );

    return (
        <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl">Edit Profile</h1>
            <form
                onSubmit={form.onSubmit(onSubmit)}
                className="flex flex-col w-full sm:w-xs"
            >
                <TextInput
                    withAsterisk
                    label="Full Name"
                    placeholder="Full Name"
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                />

                <div className="flex flex-col gap-2 mt-4">
                    <Button type="submit" variant="outline" loading={loading}>
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/profile")}
                    >
                        Cancel
                    </Button>
                    {error && <p className="text-warning">{error}</p>}
                </div>
            </form>
        </div>
    );
}
