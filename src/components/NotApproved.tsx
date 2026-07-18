import { Button, TextInput } from "@mantine/core";
import { useClientQueries } from "@zenstackhq/tanstack-query/react";
import { useState } from "react";
import { schema } from "~/zenstack/schema";

export default function NotApproved({
    onAttempt,
}: Readonly<{ onAttempt?: (approved: boolean) => void }>) {
    const client = useClientQueries(schema);
    const [accessCode, setAccessCode] = useState("");
    const [loading, setLoading] = useState(false);

    const { mutateAsync: tryAccessCode } =
        client.$procs.tryAccessCode.useMutation();

    return (
        <div className="flex flex-col gap-4 justify-start items-center p-6">
            <h1 className="text-4xl mt-40">Access Code Required</h1>
            <TextInput
                onChange={(e) => {
                    setAccessCode(e.target.value);
                }}
                withAsterisk
                placeholder="Access Code"
                size="lg"
            />
            <Button
                loading={loading}
                variant="outline"
                className="w-40!"
                onClick={() => {
                    setLoading(true);
                    tryAccessCode({ args: { accessCode } })
                        .then((approved) => {
                            onAttempt?.(approved);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }}
            >
                Submit
            </Button>
        </div>
    );
}
