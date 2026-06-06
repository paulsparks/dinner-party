"use client";

import { useAuthenticatedContext } from "@/contexts/AuthenticatedContext";

export default function Home() {
    const { user } = useAuthenticatedContext();

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-7xl">James and Paul Dinner Parties</h1>
            <p className="text-4xl">home page</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
        </div>
    );
}
