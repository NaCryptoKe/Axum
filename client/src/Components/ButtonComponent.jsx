import React from "react";

const ButtonComponent = (
    {
        children,
        variant,
        onClick,
        disabled = false,
        type = 'button'
    }) => {

    const buttonClassName = `button${variant}`;

    return (
        <button
            className={buttonClassName}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    )
}

export default ButtonComponent;