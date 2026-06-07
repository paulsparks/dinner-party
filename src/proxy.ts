import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
    const { user } =
        (await auth.api.getSession({
            headers: await headers(),
        })) ?? {};

    if (user?.role !== "Admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/404";
        return NextResponse.rewrite(url);
    }
}
export const config = {
    matcher: ["/new-party/:path*"],
};
