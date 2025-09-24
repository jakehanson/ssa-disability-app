"use client";

import Link from "next/link";
import { cloneElement, isValidElement } from "react";

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses = {
  primary:
    "bg-[color:var(--color-primary-600)] text-white hover:bg-[color:var(--color-primary-700)] focus-visible:outline-[color:var(--color-primary-500)] shadow-sm",
  secondary:
    "bg-white text-[color:var(--color-text-primary)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary-200)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-[color:var(--color-primary-400)] shadow-sm",
  subtle:
    "bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] hover:bg-[color:var(--color-primary-200)] focus-visible:outline-[color:var(--color-primary-200)]",
  ghost:
    "bg-transparent text-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-50)] focus-visible:outline-[color:var(--color-primary-200)]",
};

const sizeClasses = {
  sm: "h-9 px-4 text-sm rounded-[var(--radius-sm)]",
  md: "h-11 px-6 text-base rounded-[var(--radius)]",
  lg: "h-12 px-7 text-lg rounded-[var(--radius-lg)]",
};

export default function Button({
  href,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  icon,
  iconPosition = "right",
  ...props
}) {
  const Component = href ? Link : "button";

  const normalizedIcon = isValidElement(icon)
    ? cloneElement(icon, {
        className: `h-5 w-5 ${icon.props.className ?? ""}`.trim(),
        "aria-hidden": true,
      })
    : null;

const componentProps = href
    ? { href, prefetch: false }
    : { type };

  return (
    <Component
      {...componentProps}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {iconPosition === "left" && normalizedIcon ? normalizedIcon : null}
      {children}
      {iconPosition === "right" && normalizedIcon ? normalizedIcon : null}
    </Component>
  );
}

