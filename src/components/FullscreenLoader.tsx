import { Loader } from "@mantine/core";

export function FullscreenLoader() {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Loader color="orange" />
        </div>
    );
}
