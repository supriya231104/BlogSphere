import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { BsPersonCircle } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { clearUser } from "../utils/UserSlice";
import toast from "react-hot-toast";

import { User } from "lucide-react";

import logo from "../assets/logo.png";
import { LogOut } from "lucide-react";
import { Settings } from "lucide-react";
import AuthModal from "../utils/AuthModal";

function NavBar() {
  const { token, name, photoURL, userName, id } = useSelector(
    (slice) => slice.UserSlice
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [navHeight, setNavHeight] = useState(0);
  const [profileModal, setProfileModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  // FIX: Dependency empty array rkhna ya component mount hone par accurate height lena
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
    }
  }, [location.pathname]);

  function handleLogOut() {
    dispatch(clearUser());
    toast.success("User logged off successfully");
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* FIX: z-10 ko z-50 kiya taaki blogs iske piche se scroll ho, upar se nahi */}
      <div
        ref={navRef}
        className="w-full flex flex-col items-center sticky top-0 z-10 border-b bg-white/90 backdrop-blur-md border-gray-200 shadow-sm"
      >
        {/* MAIN INNER CONTAINER */}
        <div className="md:w-[90%] w-full flex items-center py-3 maxfourfifty:px-3 px-5 justify-between gap-4">
          {/* LEFT SECTION */}
          <div className="left flex items-center gap-3 md:gap-5 flex-grow max-w-[75%] maxsixhundread:max-w-full">
            <Link to={"/"} className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <img className="w-8 h-8 object-contain" src={logo} alt="Logo" />
                <p className="maxsixhundread:hidden font-semibold text-gray-800">
                  BlogSphere
                </p>
              </div>
            </Link>

            {/* SEARCH CONTAINER */}
            <div className="bg-gray-200/40 flex items-center justify-start rounded-3xl py-[6px] px-3 gap-2 flex-grow w-full max-w-xs md:max-w-sm">
              <Search className="font-extralight text-gray-400 h-5 w-5 flex-shrink-0" />
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    const val = searchQuery.trim();
                    if (!val) return;
                    navigate(`/search?search=${val}`);
                  }
                }}
                value={searchQuery ? searchQuery : ""}
                className="py-1 bg-transparent focus:outline-none w-full text-sm"
                placeholder="search"
                type="text"
                name="search"
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="right flex items-center gap-3 md:gap-5 flex-shrink-0">
            <div
              onClick={() => {
                if (!token) {
                  setIsAuthModalOpen(true);
                  return
                  
                }
                navigate('/add-blog')
              }}

              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiEdit className="w-5 h-5" />
              <p className="maxsixhundread:hidden text-sm font-medium">Write</p>
            </div>

            {!token && (
              <div className="flex items-center gap-2 btns flex-shrink-0">
                <Link to={"/signup"}>
                  <button className="px-3 py-1.5 rounded-3xl bg-blue-500 flex items-center justify-center text-white text-[14px] font-semibold whitespace-nowrap">
                    Sign Up
                  </button>
                </Link>
                <Link to={"/signin"}>
                  <button className="px-3 py-1.5 bg-gray-100 rounded-3xl flex items-center justify-center text-[14px] font-semibold whitespace-nowrap maxfourfifty:hidden">
                    Sign In
                  </button>
                </Link>
              </div>
            )}

            {/* Profile Trigger */}
            <div className="flex items-center flex-shrink-0">
              <div
                onClick={() => setProfileModal((prev) => !prev)}
                className="w-8 h-8 cursor-pointer"
              >
                {token ? (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    src={
                      photoURL ||
                      `https://api.dicebear.com/9.x/initials/svg?seed=${name}`
                    }
                    alt="Profile"
                  />
                ) : (
                  <div className="bg-gray-200/50 w-8 h-8 rounded-full flex items-center justify-center">
                    <FaRegUser className="font-thin w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DROPDOWN MODAL */}
        {profileModal && (
          <div
            style={{ top: `${navHeight + 8}px` }}
            className="absolute right-4 w-56 rounded-xl border border-zinc-100 bg-white p-1.5 shadow-[0_12px_30px_-4px_rgba(0,0,0,0.08)] z-10 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col text-sm font-medium text-zinc-600">
              <div
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out cursor-pointer hover:bg-zinc-50 hover:text-zinc-900 group"
                onClick={() => {
                  setProfileModal(false);
                  navigate(`/@${userName}`);
                }}
              >
                <User
                  size={18}
                  className="text-zinc-400 group-hover:text-zinc-700 transition-colors"
                />
                <span>My Profile</span>
              </div>

              <div
                onClick={() => {
                  setProfileModal(false);
                  navigate(`/edit-profile/${userName}`, { state: { id } });
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out cursor-pointer hover:bg-zinc-50 hover:text-zinc-900 group"
              >
                <Settings
                  size={18}
                  className="text-zinc-400 group-hover:text-zinc-700 transition-colors"
                />
                <span>Settings</span>
              </div>

              <hr className="my-1.5 border-zinc-100" />

              <div
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out cursor-pointer hover:bg-red-50 hover:text-red-600 group"
                onClick={() => {
                  setProfileModal(false);
                  handleLogOut();
                }}
              >
                <LogOut
                  size={18}
                  className="text-zinc-400 group-hover:text-red-500 transition-colors"
                />
                <span>Log Out</span>
              </div>
            </div>
          </div>
        )}
        
      </div>
      <Outlet />
      <AuthModal
          isAuthModalOpen={isAuthModalOpen}
          setIsAuthModalOpen={setIsAuthModalOpen}
        ></AuthModal>
    </div>
  );
}

export default NavBar;
