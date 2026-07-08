import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
function InputCompo({ type, handleOnChange, userData }) {
  const [togglePass, setTogglePass] = useState(false);
  return (
    <div className="flex flex-col  items-start gap-2">
      <label className="capitalize text-gray-900 maxfourfifty:text-sm" htmlFor={`${type}`}>
        {type}
      </label>
      <div className="flex items-center gap-3 w-full">
        <input
          type={type === "password" ? (togglePass ? "text" : "password") : type}
          value={userData[type]}
          onChange={handleOnChange}
          name={type}
          id={type}
          placeholder={`Enter your ${type}`}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 outline-none maxfourfifty:text-sm "
        />
        {type === "password" && (
          <div
            onClick={() => {
              setTogglePass((prev) => !prev);
            }}
          >
            {togglePass ? (
              <Eye className="text-gray-500 font"></Eye>
            ) : (
              <EyeOff className="text-gray-500 font" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputCompo;
