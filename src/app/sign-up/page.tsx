"use client";

import { Button, PasswordInput, TextInput } from "@mantine/core";
import {
    hasLength,
    isEmail,
    isNotEmpty,
    matchesField,
    useForm,
} from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { signUp } from "@/lib/auth-client";

interface FormValues {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const form = useForm<FormValues>({
        mode: "uncontrolled",
        validate: {
            email: isEmail("Invalid Email."),
            name: isNotEmpty("Full Name is required."),
            password: hasLength(
                { min: 8 },
                "Password must be at least 8 characters long.",
            ),
            confirmPassword: matchesField(
                "password",
                "Passwords do not match.",
            ),
        },
    });

    const onSubmit = useCallback(
        (values: FormValues) =>
            signUp.email(values, {
                onRequest: () => {
                    setError(undefined);
                    setLoading(true);
                },
                onSuccess: () => {
                    setLoading(false);
                    router.push("/sign-in");
                },
                onError: (ctx) => {
                    setLoading(false);
                    setError(ctx.error.message);
                },
            }),
        [router],
    );

    return (
        <div className="flex flex-col gap-10 justify-start items-center p-6">
            <h1 className="text-4xl mt-10">Create Account</h1>
            <form
                onSubmit={form.onSubmit(onSubmit)}
                className="flex flex-col  w-full sm:w-xs"
            >
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                />
                <TextInput
                    withAsterisk
                    label="Full Name"
                    placeholder="Full Name"
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                />
                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="Password"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                />
                <PasswordInput
                    withAsterisk
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                />

                <div className="flex flex-col gap-2 mt-4">
                    <Button type="submit" variant="outline" loading={loading}>
                        Create Account
                    </Button>
                    <p>
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="hover:underline text-link"
                        >
                            Sign in
                        </Link>
                    </p>
                    {error && <p className="text-warning">{error}</p>}
                </div>
            </form>
        </div>
    );
}
