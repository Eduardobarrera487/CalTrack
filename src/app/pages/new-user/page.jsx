import React from 'react';
import CustomInput from '@/app/_components/input';
import CustomButton from '@/app/_components/button';
import Link from 'next/link';

const newUser = () => {
    return (
        <div className='flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]'>
            <h1 className="text-2xl font-bold mb-4 text-black">Crea tu cuenta</h1>
            <form>
                <div className="flex flex-col gap-4 max-w-sm w-full">
                    <CustomInput
                        type="text"
                        placeholder="Nombre"
                        className="w-full" />
                    <CustomInput
                        type="text"
                        placeholder="Email"
                        className="w-full" />
                    <CustomInput
                        type="password"
                        placeholder="Contraseña"
                        className="w-full" />
                    <CustomInput
                        type="password"
                        placeholder="Confirmar contraseña"
                        className="w-full" />
                    <CustomInput
                        type="text"
                        placeholder="Peso en LBS"
                        className="w-full" />
                    <CustomInput
                        type="text"
                        placeholder="Altura en CM"
                        className="w-full" />
                    <CustomInput
                        type="text"
                        placeholder="Edad"
                        className="w-full" />
                    <CustomInput
                        type="text"
                        placeholder="Objetivo"
                        className="w-full" />
                    <Link href="/pages/user-details" className="w-full text-center p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors">Registrarse</Link>
                </div>
            </form>
            <Link href="/pages/login" className="text-blue-500 hover:underline flex items-center gap-2 mt-4">
                <span>&larr;</span> Volver al inicio de sesión
            </Link>
        </div>
    );
};

export default newUser;


// This code defines a simple React component for a new user registration page.
// It includes a form with an input field for the first name and styles it using Tailwind CSS classes.


