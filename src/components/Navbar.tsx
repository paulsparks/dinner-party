import { ActionIcon } from "@mantine/core";
import { UserIcon, WineIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";

export function Navbar() {
    const { user } = useAuthenticatedContext();

    return (
        <div className="w-full outline-white/20 outline-1 shadow-xl p-4 bg-navbar-background">
            <div className="flex flex-row justify-around sm:justify-center items-center h-full">
                <div className="flex flex-row gap-4 ">
                    {/* <ActionIcon
                        href="/"
                        component={Link}
                        variant="outline"
                        size="lg"
                    >
                        <HouseIcon size={24} />
                    </ActionIcon> */}
                </div>
                <Link href="/" className="text-xl sm:text-3xl md:text-5xl">
                    James and Paul Dinner Parties
                </Link>
                <div className="flex flex-row gap-4 sm:absolute right-4">
                    {user.role === "Admin" && (
                        <ActionIcon
                            href="/new-party"
                            component={Link}
                            variant="outline"
                            size="lg"
                        >
                            <WineIcon size={24} />
                        </ActionIcon>
                    )}
                    <ActionIcon
                        href="/profile"
                        component={Link}
                        variant="outline"
                        className="rounded-full!"
                        size="lg"
                    >
                        <UserIcon size={24} />
                    </ActionIcon>
                </div>
            </div>
        </div>
    );
}
