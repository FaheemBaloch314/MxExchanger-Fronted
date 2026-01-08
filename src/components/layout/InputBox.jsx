import React from 'react';
import '../../styles/InputBox.scss';

const InputBox = ({ type, label, id = false, placeholder, value, onChange }) => {
    return (
        <div className='InputBox'>
            {label && <label>{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                readOnly={id ? true : false}
                required
                value={value}
                onChange={onChange} // ✅ Ensure it's always provided
            />
        </div>
    );
};

export default InputBox;
