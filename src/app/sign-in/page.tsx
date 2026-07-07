"use client";

import { Button, Divider, PasswordInput, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { signIn } from "@/lib/auth-client";

interface FormValues {
    email: string;
    password: string;
}

export default function LoginPage() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const form = useForm<FormValues>({
        mode: "uncontrolled",
        validate: {
            email: isEmail("Invalid Email."),
            password: isNotEmpty("Password is required."),
        },
    });

    const onSubmit = useCallback(
        (values: FormValues) =>
            signIn.email(values, {
                onRequest: () => {
                    setError(undefined);
                    setLoading(true);
                },
                onSuccess: () => {
                    setLoading(false);
                    router.push(redirect ?? "/");
                },
                onError: (ctx) => {
                    setLoading(false);
                    setError(ctx.error.message);
                },
            }),
        [router, redirect],
    );

    return (
        <div className="flex flex-col gap-10 justify-start items-center p-6">
            <h1 className="text-4xl mt-10">Sign In</h1>
            <form
                onSubmit={form.onSubmit(onSubmit)}
                className="flex flex-col w-full sm:w-xs"
            >
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                />
                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="Password"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                />

                <div className="flex flex-col gap-2 mt-4">
                    <Button type="submit" variant="outline" loading={loading}>
                        Sign In
                    </Button>
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="hover:underline text-link"
                        >
                            Create account
                        </Link>
                    </p>
                    {error && <p className="text-warning">{error}</p>}
                </div>
                <Divider
                    className="*:text-lg! my-4 *:text-accent!"
                    label="or"
                />
                <GoogleSignInButton />
            </form>
        </div>
    );
}
