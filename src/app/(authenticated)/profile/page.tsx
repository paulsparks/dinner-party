"use client";

import { ActionIcon, Button } from "@mantine/core";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import Link from "next/link";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { schema } from "~/zenstack/schema";

export default function ProfilePage() {
    const { user } = useAuthenticatedContext();
    const client = useClientQueries(schema);

    const { data: accessCodes } = client.accessCode.useFindMany();
    const { mutateAsync: createAccessCode } = client.accessCode.useCreate();
    const { mutateAsync: deleteAccessCode } = client.accessCode.useDelete();

    return (
        <div className="relative flex flex-col items-center gap-6">
            <ActionIcon
                className="absolute! top-0 right-0"
                variant="outline"
                size="lg"
                component={Link}
                href="/profile/edit"
                aria-label="Edit Profile"
            >
                <PencilSimpleIcon size={18} />
            </ActionIcon>
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
            <h1 className="text-4xl">Access Codes</h1>
            <div className="flex flex-col gap-1 text-xl items-center">
                <Button
                    className="text-xl! sm:text-2xl! w-60! mb-6"
                    variant="outline"
                    onClick={() => createAccessCode({ data: {} })}
                >
                    Create new code
                </Button>

                {accessCodes?.map(({ code }) => (
                    <div
                        key={code}
                        className="flex flex-row gap-2 items-center justify-between w-34"
                    >
                        <p>{code}</p>
                        <ActionIcon
                            variant="outline"
                            color="red"
                            size="sm"
                            className="rounded-sm!"
                            onClick={() =>
                                deleteAccessCode({ where: { code } })
                            }
                        >
                            <TrashIcon size={12} />
                        </ActionIcon>
                    </div>
                ))}
            </div>
        </div>
    );
}
