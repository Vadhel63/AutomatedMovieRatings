const Button = ({ children, onClick, variant = "default" }) => (
    <button
      className={`px-4 py-2 rounded ${
        variant === "destructive" ? "bg-red-500" : "bg-blue-500"
      } text-white`}
      onClick={onClick}
    >
      {children}
    </button>
  );
  export default Button;
  