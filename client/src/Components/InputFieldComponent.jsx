import React from "react";

const InputComponent = ({type = "text", placeholder, required = false}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="input-field"
            required={required}
        />
    )
}

export default InputComponent;