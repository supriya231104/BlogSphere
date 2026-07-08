import axios from "axios";
import React, { useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BlogCard from "./BlogCard";
import { setFollowingsList } from "../utils/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { MoreHorizontal } from "lucide-react";
import EmptyBlogPage from "../pages/EmptyBlogPage";
import AboutMePage from "../pages/AboutUs";
import AuthModal from "../utils/AuthModal";
function ProfilePage() {
  const navigate = useNavigate();
  let { username } = useParams();
  username = username.replace("@", "");

  const [id, setId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isAuthModalOpen,setIsAuthModalOpen]=useState(false)
  const {
    token,
    id: userId,
    followingsList,
  } = useSelector((state) => state.UserSlice);
 
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isfollowing, setIsFollowing] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [disableFollow, setDisableFollow] = useState(false);
  const dispatch = useDispatch();
  const ownerTabs = [
    {
      name: "Home",
      api: "/blogs",
    },
    {
      name: "Saved",
      api: "/blogs/saved-blogs/details",
    },
    {
      name: "Liked",
      api: `/liked-blogs/${id}`,
    },
    {
      name: "Draft",
      api: "/blogs/draft",
    },
    {
      name: "About",
    },
  ];
  const vistorTab = [
    {
      name: "Home",
      api: "/blogs",
    },

    {
      name: "Liked",
      api: `/liked-blogs/${id}`,
    },

    {
      name: "About",
    },
  ];
  const navItem = userData ? (isOwnProfile ? ownerTabs : vistorTab) : [];
  const [activeNav, setActiveNav] = useState(0);

  async function getUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile/${username}`
      );

      setUserData(res?.data?.user);
      setFollowerCount(res?.data?.user?.followerCount);
      setIsOwnProfile(res?.data?.user?._id == userId);
      setId(res?.data?.user?._id);
      const val = followingsList?.some((one) => {
        return one?.followingId === res?.data?.user?._id;
      });
      setIsFollowing(val);
     
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  async function getFollowings() {
    if (!id) {
      return;
    }
    try {
      let idTobePassed;
      const val = userId == id;
      if (val) {
        idTobePassed = userId;
      } else {
        idTobePassed = id;
      }
      let res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/blogs/follow/details/${idTobePassed}`
      );

      setFollowings(res?.data?.follwings);

    
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  async function getBlogs() {
    if (!navItem[activeNav] || !navItem[activeNav].api) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}${navItem[activeNav]?.api}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(res?.data?.blogs);
      setIsLoading(false);
      
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  async function handleFollow() {
    setDisableFollow(true);
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      if (res?.data?.isFollowed) {
        setFollowerCount((prev) => prev + 1);
        dispatch(setFollowingsList([...followingsList, { followingId: id }]));
      } else {
        const newList = followingsList?.filter(
          (item) => item.followingId !== id
        );
        setFollowerCount((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
        });

        dispatch(setFollowingsList(newList));
        setDisableFollow(false);
      }

      setIsFollowing(res?.data?.isFollowed);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    getUser();
  }, [username]);

  useEffect(() => {
    if (!id) return;

    getFollowings();
  }, [id]);

  useEffect(() => {
    if (!userData) return;

    getBlogs();
    return () => {
      setBlogs([]);
      setIsLoading(true);
    };
  }, [activeNav, userData]);
  return (
    <>
      {userData && blogs ? (
        <div className="w-full maxninehundread:w-[90%] flex maxninehundread:flex-col-reverse maxsixhundread:items-center mx-auto">
          {/* left */}
          <div className="w-[70%] maxninehundread:w-full pr-8 maxninehundread:pr-0 border-r-[1px] maxninehundread:border-none border-gray-200 min-h-screen flex flex-col items-end ">
            <div className="w-[90%] maxninehundread:w-full pt-12 flex flex-col gap-5 items-start">
              <p className="text-3xl font-semibold maxfourfifty:hidden ">{userData?.name}</p>
              <nav
                className="flex w-full gap-3    text-sm text-gray-500 
              "
              >
                {navItem.map((one, i) => {
                  return (
                    <p
                      key={i}
                      onClick={() => {
                        setActiveNav(i);
                      }}
                      className={`cursor-pointer pb-2 ${
                        i == activeNav
                          ? "border-b-[1px] border-black text-black"
                          : ""
                      }`}
                    >
                      {one?.name}
                    </p>
                  );
                })}
              </nav>

              {isLoading && navItem[activeNav]?.name !== "About" ? (
                <div className="w-full flex flex-col gap-3 ">
                  {[1, 2, 3, 4, 5].map((one) => {
                    return <BlogCard isLoading={isLoading}></BlogCard>;
                  })}
                </div>
              ) : blogs.length > 0 ? (
                <div className="w-full flex flex-col gap-3   ">
                  {blogs.map((one) => {
                    return (
                      <BlogCard
                        key={one?._id}
                        one={one}
                        isInitiallySaved={false}
                        width={100}
                      ></BlogCard>
                    );
                  })}
                </div>
              ) : activeNav === navItem?.length - 1 ? (
                <AboutMePage
                  userData={userData}
                  followerCount={followerCount}
                ></AboutMePage>
              ) : (
                <EmptyBlogPage
                  userName={userData?.userName}
                  type={navItem[activeNav]?.name}
                ></EmptyBlogPage>
              )}
            </div>
          </div>
          {/* right */}
          <div className="flex w-1/4 maxninehundread:w-full maxninehundread:pl-0 flex-col items-start pl-5 gap-10 pt-12 ">
            <div className="flex  w-full flex-col maxfourfifty:flex-col  maxninehundread:flex-row  maxninehundread:items-center  gap-6 items-start ">
              <div className="w-20 h-20 maxninehundread:w-12 maxninehundread:h-12  rounded-full maxninehundread:flex-shrink-0 ">
                {userData?.profilePic ? (
                  <img
                    className=" rounded-full h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    src={userData?.profilePic}
                    alt=""
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${userData?.name}`}
                    alt=""
                  />
                )}
              </div>
              <div className="w-full flex flex-col items-start gap-2">
                <p className="font-medium">{userData?.name}</p>
                <p className="text-gray-600 text-[18px] maxfourfifty:text-sm">
                  {followerCount > 0 ? `${followerCount} followers` : ""}
                </p>
                <p className="w-2/3 maxninehundread:hidden text-gray-600 text-sm">{userData?.bio}</p>
              </div>
              {id === userId ? (
                <div
                  onClick={() => {
                    navigate(`/edit-profile/${userData?.userName}`, {
                      state: {
                        id,
                      },
                    });
                  }}
                  className="maxfourfifty:text-[12px] maxfourfifty:px-3 whitespace-nowrap px-5 py-2 flex items-center justify-center rounded-3xl text-sm border border-green-600 bg-green-600 font-medium text-white"
                >
                  Edit Profile
                </div>
              ) : (
                <div
                  onClick={()=>{
                    if (!token) {
                      setIsAuthModalOpen(true)
                      return
                      
                    }
                    handleFollow()
                  }}
                  className={`px-5 py-2 flex items-center justify-center rounded-3xl text-sm border border-gray-800 font-medium `}
                >
                  {isfollowing ? "Following" : "Follow"}
                </div>
              )}
            </div>
           <div className="flex flex-col items-start gap-3 w-full maxninehundread:hidden">
           {followings?.length > 0 && (
              <div className="flex flex-col gap-5 items-start w-[80%] ">
                <p className="font-medium ">Following</p>
                <div className="flex flex-col gap-3 items-start w-full">
                  {followings.map((one) => {
                    return (
                      <div className="flex items-center gap-3 justify-between w-full">
                        <div className="flex items-center justify-start gap-2">
                          <div className="w-6 h-6 ">
                            <img
                              className="w-full h-full object-cover rounded-full"
                              src={`https://api.dicebear.com/9.x/initials/svg?seed=${one?.followingId?.name}`}
                              alt=""
                            />
                          </div>
                          <p
                            onClick={() => {
                              navigate(`/${one?.followingId?.userName}`, {
                                state: {
                                  id: one?.followingId?._id,
                                },
                              });
                            }}
                            className="hover:underline"
                          >
                            {one?.followingId?.name}
                          </p>
                        </div>
                        <MoreHorizontal size={18} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
           </div>
          </div>
        </div>
      ) : (
        <h1>Loading</h1>
      )}
      <AuthModal isAuthModalOpen={isAuthModalOpen} setIsAuthModalOpen={setIsAuthModalOpen}></AuthModal>
    </>
  );
}

export default ProfilePage;
