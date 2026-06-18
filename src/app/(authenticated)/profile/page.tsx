"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";

export default function ProfilePage() {
    const { user } = useAuthenticatedContext();

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl">Profile</h1>
            <div className="flex flex-col gap-1 mt-6 text-xl items-center">
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <Button
                    className="text-xl! sm:text-2xl! w-60! mt-6"
                    variant="outline"
                    component={Link}
                    href="/sign-out"
                >
                    Sign out
                </Button>
            </div>
        </div>
    );
}
