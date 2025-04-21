import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    disabled = false,
    ...props
    }, ref) => {
    // Styles de base communs à tous les boutons
    const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    // Variantes de couleur
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        outline: 'border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 bg-transparent focus:ring-blue-500',
        ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-300'
    };

    // Tailles
    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg'
    }

    return (
        <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
        >
        {children}
        </button>
    )
})

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    className: PropTypes.string,
    disabled: PropTypes.bool
}

export default Button