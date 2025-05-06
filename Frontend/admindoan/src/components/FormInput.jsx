import React from "react";

const FormInput = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <input
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        {...props}
      />
    </div>
  );
};

export default FormInput;
