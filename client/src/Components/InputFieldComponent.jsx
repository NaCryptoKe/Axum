import React from "react";


const InputComponent = ({
    type = "text",
    placeholder,
    required = false,
    value,
    onChange
}) =>{
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="input-field"
            required={required}
            value={value}
            onChange={onChange}
        />
    )
}

export default InputComponent;