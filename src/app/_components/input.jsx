export default function CustomInput({ type, placeholder, className, ...props }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`p-2 border-black border-2 rounded-2xl text-gray-700 shadow-gray-200 shadow-md w-full ${className}`}
            {...props}
        />
    );
}