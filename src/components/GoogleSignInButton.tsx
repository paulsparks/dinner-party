import { Button } from "@mantine/core";
import { useCallback, useState } from "react";
import { signIn } from "@/lib/auth-client";
import { GoogleIcon } from "./GoogleIcon";

export function GoogleSignInButton() {
    const [loading, setLoading] = useState(false);

    const onClick = useCallback(
        () =>
            signIn.social(
                {
                    provider: "google",
                },
                {
                    onRequest: () => {
                        setLoading(true);
                    },
                    onSuccess: () => {
                        setLoading(false);
                    },
                },
            ),
        [],
    );

    return (
        <Button
            type="button"
            variant="light"
            leftSection={<GoogleIcon />}
            loading={loading}
            onClick={onClick}
        >
            Continue with Google
        </Button>
    );
}
