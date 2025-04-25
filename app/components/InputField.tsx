import React from "react";

const InputField = ({
                      id,
                      label,
                      type,
                      value,
                      onChange,
                      placeholder
                    }: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#a9b1d6] mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-[#1a1b26] border border-[#2a2e3f] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default InputField;
