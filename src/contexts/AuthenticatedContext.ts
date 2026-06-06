import { createContext, useContext } from "react";

import type { useSession } from "@/lib/auth-client";

export const AuthenticatedContext =
    createContext<ReturnType<typeof useSession>["data"]>(null);

/** Assumes this is used in pages in the (authenticated) folder. Do not use this hook elsewhere. */
export const useAuthenticatedContext = () =>
    useContext(AuthenticatedContext) as NonNullable<
        ReturnType<typeof useSession>["data"]
    >;
