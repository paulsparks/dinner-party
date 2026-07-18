import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import { Jacquard_24 } from "next/font/google";

import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Providers } from "@/components/Providers";

const font = Jacquard_24({
    weight: "400",
});

export const metadata: Metadata = {
    title: "DINNER PARTY!!!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>
            <body className={`h-full ${font.className} bg-background!`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
