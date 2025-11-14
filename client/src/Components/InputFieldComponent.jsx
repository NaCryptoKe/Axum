import React from "react";


const InputComponent = ({
    type = "text",
    placeholder,
    required = false,
    value,
    onChange,
    variant
}) =>{
    const classname = `input-${variant}`;
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={classname}
            required={required}
            value={value}
            onChange={onChange}
        />
    )
}

export default InputComponent;