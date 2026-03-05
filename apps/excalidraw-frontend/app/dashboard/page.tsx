"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, LogIn, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { HTTP_URL } from "../../config";

export default function DashboardPage() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingJoin, setLoadingJoin] = useState(false);
    const [myRooms, setMyRooms] = useState<{ id: string, slug: string }[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
            router.push("/");
            return;
        }
        const fetchMyRooms = async () => {
            try {
                const response = await fetch(`${HTTP_URL}/my-rooms`, {
                    headers: { "Authorization": token }
                });
                if (!response.ok) {
                    // if token is invalid, also push to Home.
                    router.push("/");
                    return;
                }
                const data = await response.json();
                if (data.rooms) {
                    setMyRooms(data.rooms);
                }
            } catch (err) {
                console.error("Failed to fetch my rooms", err);
            }
        };
        fetchMyRooms();
    }, [router]);

    const handleCreateRoom = async () => {
        if (!name.trim()) {
            setError("Room name cannot be empty");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }

        setLoadingCreate(true);
        setError("");

        try {
            const response = await fetch(`${HTTP_URL}/room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create room");
            }

            if (data.roomId) {
                router.push(`/canvas/${data.roomId}`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingCreate(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!slug.trim()) {
            setError("Room slug cannot be empty");
            return;
        }

        setLoadingJoin(true);
        setError("");

        try {
            const response = await fetch(`${HTTP_URL}/room/${slug}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to find room");
            }

            if (data.room && data.room.id) {
                router.push(`/canvas/${data.room.id}`);
            } else {
                throw new Error("Room not found");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingJoin(false);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-zinc-950 font-sans text-zinc-100 p-8">
            <div className="w-full max-w-4xl mt-12 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                        <Pencil className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/");
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                {/* Create Room Section */}
                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-xl flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                            <Plus className="w-6 h-6 text-indigo-400" /> Create Room
                        </h2>
                        <p className="text-zinc-400 text-sm">Start a brand new canvas and invite others.</p>
                    </div>

                    <div className="flex flex-col gap-4 flex-1 justify-center">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Room Name</label>
                            <input
                                className="w-full p-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                                type="text"
                                placeholder="e.g. brainstorming-session"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleCreateRoom}
                            disabled={loadingCreate}
                            className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingCreate ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Room"}
                        </button>
                    </div>
                </div>

                {/* Join Room Section */}
                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-xl flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                            <LogIn className="w-6 h-6 text-emerald-400" /> Join Room
                        </h2>
                        <p className="text-zinc-400 text-sm">Enter an existing room's slug to jump in.</p>
                    </div>

                    <div className="flex flex-col gap-4 flex-1 justify-center">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Room Slug</label>
                            <input
                                className="w-full p-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                                type="text"
                                placeholder="e.g. project-x"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleJoinRoom}
                            disabled={loadingJoin}
                            className="w-full py-3.5 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingJoin ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Canvas"}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 w-full max-w-4xl">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {error}
                </div>
            )}

            {/* My Rooms Section */}
            <div className="w-full max-w-4xl mt-12 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-xl flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-zinc-100">
                        Your Rooms
                    </h2>
                    <p className="text-zinc-400 text-sm">Jump back into the canvases you were previously working on.</p>
                </div>

                {myRooms.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 bg-zinc-950/30 rounded-xl border border-zinc-800 border-dashed">
                        No rooms created yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {myRooms.map((r, i) => (
                            <button
                                key={i}
                                onClick={() => router.push(`/canvas/${r.id}`)}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-xl border border-zinc-700 flex justify-between items-center text-left"
                            >
                                <span className="font-semibold text-zinc-200 truncate">{r.slug}</span>
                                <LogIn className="w-4 h-4 text-zinc-400" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
