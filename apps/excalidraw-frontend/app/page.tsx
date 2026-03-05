"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ArrowRight, Loader2 } from "lucide-react";

import { HTTP_URL } from "../config";

export default function LandingPage() {
    const [isSignin, setIsSignin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = isSignin ? `${HTTP_URL}/signin` : `${HTTP_URL}/signup`;
            const body = isSignin ? { username, password } : { username, password, name };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Authentication failed");
            }

            if (isSignin) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    router.push("/dashboard");
                } else {
                    throw new Error(data.message || "Authentication failed");
                }
            } else {
                setIsSignin(true);
                setUsername("");
                setPassword("");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-zinc-950 font-sans relative overflow-hidden text-zinc-100">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000 mix-blend-screen pointer-events-none"></div>

            <div className="flex flex-col md:flex-row shadow-2xl shadow-indigo-500/10 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-2xl overflow-hidden w-[90%] max-w-[1000px] min-h-[600px] z-10 transition-all duration-500">

                {/* Left Side: Branding & Pitch */}
                <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between bg-zinc-900/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Pencil className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-white via-indigo-100 to-indigo-400 text-transparent bg-clip-text">
                                Excalidraww
                            </h1>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-6">
                            Where ideas take <span className="text-indigo-400">shape</span>.
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            A blazing fast, minimalist collaborative whiteboard.
                            Sketch, diagram, and brainstorm with your team in real-time.
                        </p>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-950/50">

                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center justify-center gap-3 mb-10">
                        <Pencil className="w-6 h-6 text-indigo-400" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Excalidraww</h1>
                    </div>

                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-10 text-center md:text-left">
                            <h3 className="text-3xl font-semibold mb-2 text-zinc-100 transition-all">
                                {isSignin ? "Welcome back" : "Create account"}
                            </h3>
                            <p className="text-zinc-400 text-sm">
                                {isSignin
                                    ? "Enter your details to access your dashboard."
                                    : "Sign up to start sketching with your team."}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-4">
                            {!isSignin && (
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        className="w-full p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner text-zinc-100"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    className="w-full p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner text-zinc-100"
                                    type="text"
                                    placeholder="your@email.com"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                                    {isSignin && <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">Forgot?</span>}
                                </div>
                                <input
                                    className="w-full p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner text-zinc-100"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isSignin ? "Sign In" : "Sign Up"}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-zinc-500">
                            {isSignin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setIsSignin(!isSignin);
                                    setError("");
                                }}
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                            >
                                {isSignin ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}