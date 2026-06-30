"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_URL } from "../config";

export default function AuthPage({isSignin}: {isSignin: boolean}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        if (!username.trim() || !password.trim() || (!isSignin && !name.trim())) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            if (isSignin) {
                const response = await axios.post(`${HTTP_URL}/signin`, {
                    username,
                    password
                });
                
                if (response.data && response.data.token) {
                    localStorage.setItem("token", response.data.token);
                    router.push("/dashboard");
                } else {
                    setError(response.data.message || "Invalid credentials");
                }
            } else {
                const response = await axios.post(`${HTTP_URL}/signup`, {
                    username,
                    password,
                    name
                });

                if (response.data && response.data.userId) {
                    // Auto sign in user after successful signup
                    try {
                        const signinRes = await axios.post(`${HTTP_URL}/signin`, {
                            username,
                            password
                        });
                        if (signinRes.data && signinRes.data.token) {
                            localStorage.setItem("token", signinRes.data.token);
                            router.push("/dashboard");
                        } else {
                            router.push("/signin");
                        }
                    } catch (e) {
                        router.push("/signin");
                    }
                } else {
                    setError(response.data.message || "Failed to create account");
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Incorrect username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-zinc-50">
            <div className="flex flex-col gap-4 p-6 border border-zinc-200 rounded-lg bg-white shadow-md w-80">
                <h2 className="text-xl font-bold text-center text-zinc-800">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h2>
                
                {!isSignin && (
                    <input 
                        className="p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-black w-full outline-none focus:border-zinc-400" 
                        type="text" 
                        placeholder="Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                
                <input 
                    className="p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-black w-full outline-none focus:border-zinc-400" 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                <input 
                    className="p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-black w-full outline-none focus:border-zinc-400" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                {error && (
                    <div className="text-red-500 text-sm text-center font-medium">
                        {error}
                    </div>
                )}
                
                <button 
                    disabled={loading}
                    className="p-2 border border-zinc-300 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:bg-zinc-400 w-full transition-colors cursor-pointer font-medium" 
                    onClick={handleSubmit}
                >
                    {loading ? "Please wait..." : isSignin ? "Sign In" : "Sign Up"}
                </button>
                
                <div className="text-center text-sm text-zinc-500 mt-2">
                    {isSignin ? (
                        <>
                            Don't have an account?{" "}
                            <span 
                                className="text-zinc-800 font-semibold underline cursor-pointer hover:text-zinc-600" 
                                onClick={() => router.push("/signup")}
                            >
                                Sign Up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span 
                                className="text-zinc-800 font-semibold underline cursor-pointer hover:text-zinc-600" 
                                onClick={() => router.push("/signin")}
                            >
                                Sign In
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}