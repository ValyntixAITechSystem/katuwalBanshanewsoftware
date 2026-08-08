// // src/components/Button.jsx
// const Button = ({ 
//   children, 
//   variant = 'primary', 
//   size = 'md', 
//   className = '', 
//   disabled = false,
//   type = 'button',
//   onClick,
//   ...props 
// }) => {
//   const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
//   const variants = {
//     // primary hover:bg-primary-dark
//     primary: 'bg-primary text-green-600 border-green-600  focus:ring-2 focus:ring-primary focus:ring-offset-2',
//     secondary: 'bg-gray-200 text-green-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
//     outline: 'border-2 border-primary text-green-600 hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary focus:ring-offset-2',
//     danger: 'bg-red-600 text-green-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
//     success: 'bg-green-600 text-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
//   };

//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base',
//   };

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

// src/components/Button.jsx
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-200 focus:ring-green-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50 focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200 focus:ring-red-500',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-200 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;