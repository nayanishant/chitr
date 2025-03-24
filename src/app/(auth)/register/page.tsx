"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CredentialState = {
  email: string;
  password: string;
  name: string;
};

export default function Register() {
  const [credentials, setCredentials] = useState<CredentialState>({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register.");
      }

      toast.success("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-between items-center bg-gray-950 flex-col p-1">
      <div className="flex justify-center items-center h-9/10 flex-col gap-8">
        <p className="text-white text-4xl">TasveerJunction</p>
        <p className="text-white text-2xl">Register to get full access</p>
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center gap-3 text-gray-400 w-lg p-2"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={credentials.name}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded p-2 outline-none focus:ring-2 focus:ring-gray-700 bg-gray-900 text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded p-2 outline-none focus:ring-2 focus:ring-gray-700 bg-gray-900 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded p-2 outline-none focus:ring-2 focus:ring-gray-700 bg-gray-900 text-white"
          />
          <p className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="underline text-blue-400">
              Log In
            </a>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-[8rem] bg-gray-700 p-2 text-white rounded cursor-pointer hover:bg-gray-600 uppercase"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
