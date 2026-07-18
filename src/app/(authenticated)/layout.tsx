"use client";

import { notifications } from "@mantine/notifications";
import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { FullscreenLoader } from "@/components/FullscreenLoader";
import { Navbar } from "@/components/Navbar";
import NotApproved from "@/components/NotApproved";
import { AuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { useSession } from "@/lib/auth-client";

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
    const redirect = usePathname();
    const router = useRouter();
    const { data: session, isPending, refetch } = useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/sign-in?redirect=${redirect}`);
        }
    }, [isPending, redirect, router, session]);

    if (isPending || !session) {
        return <FullscreenLoader />;
    }

    if (!session.user.approved) {
        return (
            <NotApproved
                onAttempt={(approved) => {
                    if (approved) {
                        notifications.show({
                            message: "Success!",
                            position: "top-right",
                            color: "green",
                        });
                        refetch();
                    } else {
                        notifications.show({
                            message: "Error: invalid code",
                            position: "top-right",
                            color: "red",
                        });
                    }
                }}
            />
        );
    }

    return (
        <AuthenticatedContext value={session}>
            <div className="flex flex-col h-full">
                <Navbar />
                <div className="grow p-6">{children}</div>
            </div>
        </AuthenticatedContext>
    );
}
