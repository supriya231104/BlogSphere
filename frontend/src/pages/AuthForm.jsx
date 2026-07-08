import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/UserSlice";
import InputCompo from "../components/InputCompo";
import sideImg from "../assets/sideImg.jpg";
import validator from "validator";
import google from "../assets/googleIcon.svg";
import { googleAuth } from "../firebase.js";
function AuthForm({ type }) {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
  });


  const [error, setError] = useState({});
  const [rules, setPasswordRules] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const [usernotExist,setUserNotExist]=useState(false)
  // const [isFocus, setIsFocus] = useState(false);
  const getPasswordRules = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
    };
  };
  useEffect(() => {
    const passrules = getPasswordRules(userData.password);
    setPasswordRules(passrules);
  }, [userData.password]);
  function validateForm() {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (type === "signup") {
      if (!userData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (!nameRegex.test(userData.name)) {
        newErrors.name = "Enter valid user name";
      }
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!validator.isEmail(userData.email)) {
      newErrors.email = "Email is not valid";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(userData.password)) {
      newErrors.password = "Password is not valid";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  // AuthForm.jsx mein handleAuthForm function ko update karo:

  async function handleAuthForm(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${type}`,
        userData
      );

      if (type === "signup") {
       
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        
      } else {
      
        const { email, _id,name ,userName} = res?.data?.user;
        const { token } = res?.data;
        dispatch(setUser({ email, token, id: _id ,name,userName}));
        toast.success("Logged in successfully!");
      }

      setUserData({ email: "", password: "", name: "" });
    } catch (error) {
      if (error?.response?.data?.usernotExist) {
        setUserNotExist(true)
        
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  async function handleGoogleAuth() {
    
    try {
      let data = await googleAuth();
      console.log(data);
      if (!data) {
        throw new Error(data || "Google authentication failed");
        
      }
      const {user,idToken}=data
      console.log(idToken);
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        {
          accessToken: idToken,
        }
      );

    
      const { email, _id,name,userName } = res?.data?.user;
      const { token } = res?.data;
      const {photoURL}=data?.user
      dispatch(setUser({email,id:_id,name,token,photoURL,userName}))
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    setUserData({ email: "", password: "", name: "" });
    setError({});
    setUserNotExist(false)
  }, [location.pathname]);
  function handleOnChange(e) {
    
    setUserNotExist(false)

   
    const name = e.target.name;
    setError((prev)=>{
      return {...prev,[name]:""}
    })
    const value = e.target.value;

    setUserData((prev) => ({ ...prev, [name]: value }));
  }
  return (
    <div className="lg:w-[70%] maxninehundread:w-[90%] min-h-[380px] flex my-10 w-[80%] justify-center">
    <div className="left font-poppins maxninehundread:w-full  lg:w-[70%] bg-white   px-5  flex flex-col justify-center items-start gap-4 maxsixhundread:gap-7">
      <div className="flex flex-col gap-3 items-start">
        <p className="text-2xl font-semibold text-indigo-600  maxsixhundread:text-xl">
          Welcome to Blog Application
        </p>
        {type === "signup" ? (
          <div className="flex w-full gap-4 text-gray-500 maxfourfifty:text-sm">
            <p>Already have an account?</p>
            <Link className="underline text-black/90" to="/signin">
              Log in
            </Link>
          </div>
        ) : (
          <div className="flex w-full gap-4 text-gray-500 maxfourfifty:text-sm">
            <p>Don't have an account?</p>
            <Link className="underline text-black/90" to="/signup">
              Register
            </Link>
          </div>
        )}
      </div>
      <form
        onSubmit={handleAuthForm}
        className="w-full  flex flex-col gap-4  "
      >
        {type === "signup" && (
          <>
            <InputCompo
              type={"name"}
              handleOnChange={handleOnChange}
              userData={userData}
            ></InputCompo>
            {error.name && (
              <p className="text-red-500 text-sm">{error.name}</p>
            )}
          </>
        )}
        {
          <>
            <InputCompo
              type={"email"}
              handleOnChange={handleOnChange}
              userData={userData}
            ></InputCompo>
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </>
        }

        {
          <>
            <InputCompo
              type={"password"}
              handleOnChange={handleOnChange}
              userData={userData}
            ></InputCompo>


            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}
            {usernotExist&&<p className="text-red-500 text-sm">Invalid email or password.</p>
            }

            {type === "signup" && userData?.password && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-xs md:text-sm">
                <div
                  className={`flex items-center h-full ${
                    rules.minLength ? "text-green-500" : "text-red-500"
                  }`}
                >
                  • At least 8 characters
                </div>

                <div
                  className={`flex items-center h-full ${
                    rules.hasUpper ? "text-green-500" : "text-red-500"
                  }`}
                >
                  • One uppercase letter
                </div>

                <div
                  className={`flex items-center h-full ${
                    rules.hasLower ? "text-green-500" : "text-red-500"
                  }`}
                >
                  • One lowercase letter
                </div>

                <div
                  className={`flex items-center h-full ${
                    rules.hasNumber ? "text-green-500" : "text-red-500"
                  }`}
                >
                  • One number
                </div>

                <div
                  className={`flex items-center h-full ${
                    rules.hasSpecial ? "text-green-500" : "text-red-500"
                  }`}
                >
                  • One special character (@$!%*?&)
                </div>
              </div>
            )}
          </>
        }
        {type === "signup" && (
          <div className="flex flex-col gap-5">
            <div className=" flex gap-3 items-center">
              <input
                className="h-4 w-4 accent-black"
                type="checkbox"
                name=""
                id=""
              />
              <p className="font-medium  text-black/70 maxfourfifty:text-sm">
                I want to receive emails about this product.
              </p>
            </div>
            <p className="text-gray-500 maxfourfifty:text-sm">
              By creating an account you agree to{" "}
              <span className="underline text-gray-900 ">Terms of use</span>{" "}
              and{" "}
              <span className="underline text-gray-900">Privacy Policy</span>
            </p>
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 mx-auto mt-5 w-[150px] rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:scale-105 transition-all duration-300 shadow-md"
        >
          {type == "signup" ? "Register" : "Log in"}
        </button>
      </form>
     
    <div className="w-full flex flex-col items-center gap-2">
      <p>Or</p>
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="bg-[#ebe8e88f] flex-shrink-0 min-w-[160px] py-2 px-3  justify-between rounded-3xl flex items-center gap-5 hover:bg-[#ebe8e8d1] active:scale-90 transition-all duration-500"
      >
        <p className="text-gray-800 ">Continue with google</p>
        <img src={google} className="w-8 h-8" alt="" />
      </button>
    </div>
    </div>
    <div className="right w-[40%] maxninehundread:hidden">
      <img className="w-full h-full object-cover" src={sideImg} alt="" />
    </div>
  </div>
  );
}

export default AuthForm;
