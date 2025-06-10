export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/dumbbells.svg"
                alt="CalTrack Logo"
                width={50}
                height={50}
            />
            <h1 className="text-2xl font-bold text-black">CalTrack</h1>
        </div>
    );
}