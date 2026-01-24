export function Input({ label, name, type = "text", value, onChange, error }) {
    return (
        <div className="input-group">
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}