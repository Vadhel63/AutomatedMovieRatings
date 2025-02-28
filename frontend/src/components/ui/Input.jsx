const Input = ({ name, type = "text", value, onChange, placeholder }) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border p-2 w-full rounded"
    required
  />
);

export default Input;
