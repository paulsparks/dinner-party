import type { BetterAuthPlugin } from "better-auth";

export const additionalTables = () => {
    return {
        id: "additional-tables",
    } satisfies BetterAuthPlugin;
};
