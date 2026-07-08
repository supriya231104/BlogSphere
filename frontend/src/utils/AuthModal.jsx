import { Lock, Sparkle, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
function AuthModal({ isAuthModalOpen, setIsAuthModalOpen,msg }) {
  if (!isAuthModalOpen) {
    return null;
  }
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        setIsAuthModalOpen(false);
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="maxfourfifty:w-[90%] maxsixhundread:w-[80%] midbreakpoint:w-1/2 w-1/3   relative bg-white shadow-2xl rounded-3xl  flex flex-col items-center px-5 py-8 gap-6"
      >
        <X className="cursor-pointer w-5 h-5 top-4 right-5 absolute" onClick={()=>{setIsAuthModalOpen(false)}}></X>
        <div className="flex items-center flex-col gap-5 w-full justify-center ">
         
          <img className="w-8 h-8 object-contain" src={logo} alt="Logo" />
          <h1 className="text-2xl font-semibold maxfourfifty:text-[18px] maxsixhundread:text-xl ">Join BlogSphere</h1>
        </div>
        <p className="text-center text-sm maxfourfifty:text-[12px] ">
          Create a free account to like blogs, join discussions and follow your
          favourite writers.
        </p>
        <div className="flex w-full justify-center gap-5">
          <button
            className="bg-black maxfourfifty:text-[12px] maxsixhundread:text-sm  text-white py-2 px-4 rounded-3xl text-sm cursor-pointer "
            onClick={() => {
              setIsAuthModalOpen(false)
              navigate("/signup");
            }}
          >
            Continue
          </button>
          <button onClick={()=>{
            setIsAuthModalOpen(false)
          }} className="border maxfourfifty:text-[12px] maxsixhundread:text-sm border-black  py-2 px-4 rounded-3xl text-sm cursor-pointer ">
            Keep Reading
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
