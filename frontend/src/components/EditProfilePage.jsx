import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../utils/UserSlice";
function EditProfilePage() {
  const location = useLocation();
  
  const [openEditProfile, setOpenEditProfile] = useState(true);
  const [deleteProfilePic,setDeleteProfilePic]=useState(false)
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    image: null,
    previewUrl: "",
    userName: "",
  });

  const [initialData, setInitialData] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  const {
    token,
    id,
    userName,
    photoURL,
  } = useSelector((state) => state.UserSlice);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function getUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`
      );
      const data = {
        name: res?.data?.user?.name,
        bio: res?.data?.user?.bio,
        previewUrl: res?.data?.user?.profilePic,
        userName: res?.data?.user?.userName,
      };

      setUserData(data);
      setInitialData(data);
     
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  function handleOnChange(e) {
    const key = e.target.name;
    const val = e.target.value;
    setUserData((prev) => {
      return { ...prev, [key]: val };
    });
  }

  function handleFileChange(e) {
    let val = e.target.files[0];
    const previewUrl = URL.createObjectURL(val);
    setUserData((prev) => {
      return { ...prev, image: val, previewUrl };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsButtonDisabled(true);
    try {
      let formdata = new FormData();
      formdata.append("name", userData.name);

      formdata.append("bio", userData.bio);
      if (userData?.image) {
        formdata.append("image", userData.image);
      }
      formdata.append("userName", userData.userName);
      formdata.append("deleteProfilePic",deleteProfilePic)
     
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { email, userName, name, profilePic: photoURL } = res?.data?.user;
      dispatch(setUser({ email, userName, name, photoURL, token, id }));
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    getUser();
    return () => {
      if (userData?.previewUrl) {
        URL.revokeObjectURL(userData?.previewUrl);
      }
    };
  }, []);
  useEffect(() => {
    const isEqual = JSON.stringify(userData) === JSON.stringify(initialData);

    setIsButtonDisabled(isEqual);
  }, [userData, initialData]);
  return (
    <div
    onClick={() => {
      setOpenEditProfile(false);
      navigate(`/${userName}`, {
        state: {
          id,
        },
      });
    }}
    className="fixed inset-0 z-20   bg-black/20 flex justify-center items-center "
  >
    {openEditProfile && (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="lg:w-[36%] w-[60%] maxeighthun:w-[90%]   maxfourfifty:px-3 relative px-8 py-4 rounded-lg flex flex-col gap-5 items-center    bg-white"
      >
        <p className="font-medium text-xl maxfourfifty:text-base">Profile information</p>

        <X
          onClick={() => {
            setOpenEditProfile(false);
            navigate(`/${userName}`, {
              state: {
                id,
              },
            });
          }}
          className="font-thin absolute right-5 top-3 maxsixhundread:w-4"
        ></X>

        <div className="w-full flex flex-col ">
          <p className="text-start">Photo</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex w-full items-start   gap-5 py-3">
              <label htmlFor="profilepic">
                {(userData?.previewUrl) ? (
                   <div className="w-20 h-20 rounded-full maxsixhundread:w-12 maxsixhundread:h-12">
                   <img
                     className="object-cover h-full w-full rounded-full"
                     referrerPolicy="no-referrer "
                     src={userData.previewUrl}
                     alt=""
                   />
                 </div>
                ) : (
                  <div className="w-20 h-20 rounded-full maxsixhundread:w-12 maxsixhundread:h-12 bg-gray-200 overflow-hidden flex justify-center items-center relative">
                  {/* The Head */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full absolute -top-1"></div>
                  {/* The Shoulders (The bottom part of the circle) */}
                  <div className="w-20 h-20 bg-gray-300 rounded-full absolute top-8"></div>
                </div>
                 
                )}
                <input
                  onChange={handleFileChange}
                  className="hidden"
                  type="file"
                  name="image"
                  id="profilepic"
                />
              </label>
              <div className="w-3/4  flex flex-col  items-start gap-3">
                <div className="flex gap-3 ">
                  <label htmlFor="profilepic">
                    <p className="text-green-600 maxsixhundread:text-sm">Update</p>
                    <input
                      onChange={handleFileChange}
                      className="hidden"
                      type="file"
                      name="image"
                      id="profilepic"
                    />
                  </label>

                  <p onClick={()=>{
                    setDeleteProfilePic(true)
                    setUserData((prev)=>{
                      
                     return {...prev,["previewUrl"]:null}
                    })

                  }} className="text-red-600 maxsixhundread:text-sm">Remove</p>
                </div>
                <p className="text-wrap  text-gray-500 maxsixhundread:text-sm ">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000
                  pixels per side.
                </p>
              </div>
            </div>
            <div className=" w-full flex flex-col gap-3">
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="name" className="text-sm text-gray-700">
                  Name*
                </label>
                <input
                  className="w-full py-3 rounded-md bg-gray-100 px-2 outline-none maxsixhundread:text-sm"
                  value={userData?.name}
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="userName" className="text-sm text-gray-700">
                  Username*
                </label>
                <input
                  className="w-full py-3 rounded-md bg-gray-100 px-2 outline-none maxsixhundread:text-sm"
                  value={userData?.userName}
                  type="text"
                  name="userName"
                  id="userName"
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="bio" className="text-sm text-gray-700">
                  Bio
                </label>
                <textarea
                  className=" maxsixhundread:text-sm w-full py-3 rounded-md bg-gray-100 px-2 outline-none resize-none"
                  value={userData?.bio}
                  type="text"
                  name="bio"
                  rows={3}
                  id="bio"
                  onChange={handleOnChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
            <button
              disabled={isButtonDisabled}
              className={`${
                isButtonDisabled
                  ? "bg-green-300 cursor-not-allowed text-black"
                  : "bg-green-800 cursor-pointer text-white "
              } px-3 py-2 rounded-md w-[20%]  maxsixhundread:w-full`}
            >
              Save
            </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
}
// 1/3+2/11 17/33

export default EditProfilePage;
