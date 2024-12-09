const Button = ({ type = 'submit', className, ...props }) => (
    <button
        type={type}
        className={`
        inline-flex 
        items-center 
        px-4 py-2 
        bg-[#4438ca] 
        border border-transparent
        font-semibold text-white uppercase tracking-widest 
        hover:bg-[#19144d] active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 
        disabled:opacity-25 
        transition ease-in-out duration-150 ${className} `}
        {...props}
    />
)

export default Button
