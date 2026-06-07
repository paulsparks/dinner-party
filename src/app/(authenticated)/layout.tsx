"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { FullscreenLoader } from "@/components/FullscreenLoader";
import { Navbar } from "@/components/Navbar";
import { AuthenticatedContext } from "@/contexts/AuthenticatedContext";
import { useSession } from "@/lib/auth-client";

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/sign-in?redirect=${pathname}`);
        }
    }, [isPending, pathname, router, session]);

    if (isPending || !session) {
        return <FullscreenLoader />;
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
