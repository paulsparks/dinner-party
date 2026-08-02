import { ActionIcon, Button, createTheme } from "@mantine/core";

export const theme = createTheme({
    primaryColor: "orange",
    components: {
        Button: Button.extend({
            styles: {
                root: {
                    borderWidth: "0.125rem",
                    letterSpacing: "0.02em",
                    transition:
                        "transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
                },
            },
        }),
        ActionIcon: ActionIcon.extend({
            styles: {
                root: {
                    borderWidth: "0.125rem",
                },
            },
        }),
    },
    colors: {
        orange: [
            "#fffaf7",
            "#fff2e8",
            "#ffdfc4",
            "#ffc49a",
            "#ffa06b",
            "#f07c3e",
            "#d45e1e",
            "#b04415",
            "#e48e25",
            "#652b0b",
        ],
        dark: [
            "#ffe8db",
            "#d7bda7",
            "#c09572",
            "#8d623f",
            "#543b26",
            "#3c2a1b",
            "#2a1d13",
            "#20160e",
            "#17100a",
            "#0e0a06",
        ],
        red: [
            "#fdf3f2",
            "#fae4e1",
            "#f5cdc7",
            "#f0b2a8",
            "#e0746c",
            "#e37463",
            "#dd5540",
            "#d03c25",
            "#ad321f",
            "#8f2919",
        ],
    },
});
