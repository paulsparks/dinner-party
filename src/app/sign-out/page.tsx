"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullscreenLoader } from "@/components/FullscreenLoader";
import { signOut } from "@/lib/auth-client";

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    }, [router]);

    return <FullscreenLoader />;
}
