"use client";

import { MantineProvider, type MantineProviderProps } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuerySettingsProvider } from "@zenstackhq/tanstack-query/react";
import { Jacquard_24 } from "next/font/google";
import { theme } from "@/app/theme";

const font = Jacquard_24({ weight: "400" });

const mantineTheme: MantineProviderProps["theme"] = {
    ...theme,
    fontFamily: font.style.fontFamily,
    fontSizes: {
        sm: "12pt",
        md: "14pt",
    },
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
            <QueryClientProvider client={queryClient}>
                <QuerySettingsProvider value={{ endpoint: "/api/model" }}>
                    {children}
                </QuerySettingsProvider>
            </QueryClientProvider>
        </MantineProvider>
    );
}
