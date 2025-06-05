export default function CustomButton({ text, className, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors ${className}`}
        >
            {text}
        </button>
    );
}