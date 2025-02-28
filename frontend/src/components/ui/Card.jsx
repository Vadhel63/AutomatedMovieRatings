const Card = ({ children, className }) => (
  <div className={`shadow-md p-4 rounded-lg bg-white ${className}`}>
    {children}
  </div>
);
export default Card;
