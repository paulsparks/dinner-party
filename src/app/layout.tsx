import {
    ColorSchemeScript,
    MantineProvider,
    type MantineProviderProps,
    mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import { Jacquard_24 } from "next/font/google";
import { theme } from "./theme";

import "./globals.css";
import "@mantine/core/styles.css";

const font = Jacquard_24({
    weight: "400",
});

export const metadata: Metadata = {
    title: "DINNER PARTY!!!",
};

const mantineTheme: MantineProviderProps["theme"] = {
    ...theme,
    fontFamily: font.style.fontFamily,
    fontSizes: {
        sm: "12pt",
        md: "14pt",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${font.className} h-full`}
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>
            <body className={`h-full ${font.className} bg-background!`}>
                <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
                    <div className="h-full p-10">{children}</div>
                </MantineProvider>
            </body>
        </html>
    );
}
