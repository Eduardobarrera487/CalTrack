import ReverseArrowButton from "@/app/_components/ReverseArrowButton";
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto h-dvh p-6 bg-white">
        <ReverseArrowButton string="/pages/aiChat" />
      <h1 className="text-3xl font-bold mb-4 text-black">Sobre Nosotros</h1>
      <p className="mb-4 text-black">
        Bienvenido a CalTrack, tu asistente personal para el seguimiento de calorías y recetas. Nuestro objetivo es ayudarte a llevar un estilo de vida saludable y equilibrado.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-black">Nuestra Misión</h2>
      <p className="mb-4 text-black">
        Proporcionar una plataforma fácil de usar para que puedas registrar tus comidas, seguir tus objetivos nutricionales y descubrir nuevas recetas saludables.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-black">Nuestro Equipo</h2>
      <p className="text-black">
        Somos un equipo de estudiantes apasionado por la nutrición y la tecnología, comprometidos en ofrecerte las mejores herramientas para alcanzar tus metas de salud.
      </p>
    </div>
  );
}