"use client";
import React, { useState } from "react";
import CustomInput from "@/app/_components/input"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // Or your icon library
import CaltrackLogo from "@/app/_components/caltrackLogo"; // Adjust path if needed

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here (API call, etc.)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md flex flex-col items-center relative mb-8">
        <button
          className="absolute left-0 top-1 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
          <span>Regresar</span>
        </button>
        <CaltrackLogo className="mx-auto" />
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Olvidé mi contraseña</h1>
        <p className="mb-6 text-gray-600 text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors w-full"
          >
            Enviar enlace de restablecimiento
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;