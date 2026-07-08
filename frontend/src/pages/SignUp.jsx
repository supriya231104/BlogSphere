import { useState } from "react";

function SignUp() {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
  });
  async function handleRegister(e) {
    e.preventDefault();
   
    let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    let data = await response.json();
    
  }
  function handleOnChange(e) {
   
    setUserData((prev) => {
      let newData = { ...prev };
      newData[e.target.name] = e.target.value;
     
      return newData;
    });
  }
  return (
    <div className="w-[40%] min-h-[300px] flex justify-center items-center">
      <form className="w-full h-full mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Sign Up
        </h2>

        <input
          type="name"
          value={userData.name}
          onChange={handleOnChange}
          name="name"
          placeholder="Enter name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="email"
          value={userData.email}
          onChange={handleOnChange}
          name="email"
          placeholder="Enter email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="password"
          value={userData.password}
          onChange={handleOnChange}
          name="password"
          placeholder="Enter password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
