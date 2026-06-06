import { type PropsWithChildren, Suspense } from "react";
import { FullscreenLoader } from "@/components/FullscreenLoader";

export default function SignInLayout({
    children,
}: Readonly<PropsWithChildren>) {
    return <Suspense fallback={<FullscreenLoader />}>{children}</Suspense>;
}
