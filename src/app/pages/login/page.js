import CustomInput from "@/app/_components/input";
import Logo from "@/app/_components/caltrackLogo";
import CustomButton from "@/app/_components/button";
import Link from "next/link";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <Logo />
            <form className="flex flex-col gap-4 w-full max-w-sm">
                <CustomInput
                    type="email"
                    placeholder="Nombre de usuario/email"
                    className="w-full" />

                <CustomInput
                    type="password"
                    placeholder="Contraseña"
                    className="w-full" />
                <CustomButton className="w-full" text="Ingresar" />

                <div className="flex justify-between items-center text-sm text-gray-600">
                    <Link href="/forgot-password" className="hover:underline">
                        ¿Olvidó su contraseña? </Link>
                    <Link href="/pages/new-user" className="hover:underline">
                        Registrarse </Link>
                    <Link href="/pages/aiChat">
                        <span className="hover:underline">Chat with AI</span>
                    </Link>

                </div>
            </form>
        </div>
    );
}