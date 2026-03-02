"use client"
export default function AuthPage({isSignin}: {isSignin: boolean}) {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4 p-4 border border-zinc-200 rounded-lg">
            <input className="p-2 border border-zinc-200 rounded-lg bg-zinc-100 text-black w-72" type="text" placeholder="username" ></input>
            <input className="p-2 border border-zinc-200 rounded-lg bg-zinc-100 text-black w-72" type="password" placeholder="password" ></input>
            <button className="p-2 border border-zinc-200 rounded-lg bg-zinc-400 text-black w-72" onClick={()=>{}}>{isSignin ? "Sign In" : "Sign Up"}</button>
        </div>
        </div>
    )
}