"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignIn() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...credentials,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid credentials");
        return;
      }

      toast.success("Login successful! Redirecting...");

      router.push("/upload");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-between items-center bg-gray-950 flex-col p-1">
      <div className="flex justify-center items-center h-9/10 flex-col gap-8">
        <p className="text-white text-2xl sm:text-3xl md:text-5xl xl:text-5xl">TasveerJunction</p>
        <p className="text-white text-[12px] sm:text-[16px] md:text-2xl xl:text-2xl">Log in to your account</p>
        <form
          method="post"
          className="flex flex-col items-center gap-3 text-gray-400 w-[20rem] p-2 sm:w-sm md:w-md xl:w-xl"
          onSubmit={handleSignIn}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="border-2 border-gray-800 rounded p-2 w-full outline-none focus:ring-2 focus:ring-gray-700"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="border-2 border-gray-800 rounded p-2 w-full outline-none focus:ring-2 focus:ring-gray-700"
          />
          <p className="text-gray-400 text-[12px] sm:text-[16px] md:text-sm text-center">
            Not Registered?{" "}
            <a href="/register" className="underline text-blue-400">
              Register
            </a>
          </p>
          <button
            className="w-[4rem] text-[12px] sm:text-[16px] sm:w-[6rem] md:w-[8rem] bg-gray-700 p-2 text-white rounded cursor-pointer hover:bg-gray-600 uppercase"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
