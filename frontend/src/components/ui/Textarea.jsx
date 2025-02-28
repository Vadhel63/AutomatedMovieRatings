const Textarea = ({ name, value, onChange, placeholder }) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border p-2 w-full rounded"
    required
  />
);

export default Textarea;
