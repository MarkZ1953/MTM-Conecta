import { Button as PrimeButton } from 'primereact/button'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'teal' | 'rose'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  label?: string
  loading?: boolean
}

const severityMap = {
  primary: 'info',
  accent: 'warning',
  outline: 'secondary',
  ghost: 'secondary',
  teal: 'success',
  rose: 'danger',
} as const

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  label,
  ...props
}: ButtonProps) {
  const severity = severityMap[variant]
  const sizeMap = {
    sm: 'p-button-sm',
    md: 'p-button-md',
    lg: 'p-button-lg',
  }

  return (
    <PrimeButton
      severity={severity}
      icon={icon}
      label={label || (typeof children === 'string' ? children : undefined)}
      className={`${sizeMap[size]} ${variant === 'outline' ? 'p-button-outlined' : ''} ${variant === 'ghost' ? 'p-button-text' : ''} ${className}`}
      {...props}
    />
  )
}
