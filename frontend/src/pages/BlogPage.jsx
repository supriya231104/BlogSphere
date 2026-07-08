import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { PiHandsClapping } from "react-icons/pi";
import { FaHandsClapping } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";
import CommentModal from "../components/CommentModal";
import EditorJSRenderer from "../components/EditorJsRenderer";
import { setFollowingsList } from "../utils/UserSlice";
import { LuPencil } from "react-icons/lu";
import AuthModal from "../utils/AuthModal";
import BlogSkeleton from "./BlogSkeleton";


function BlogPage() {
  const { followingsList } = useSelector((state) => state.UserSlice);
  const [blogData, setBlogData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [likeCount, SetLikeCount] = useState(0);
  const [commentCount, SetCommentCount] = useState(0);
  const [isCommentModal, SetCommentModal] = useState(false);
  const [blogId, setBlogId] = useState([]);
  const disptach = useDispatch();
  const [isfollowing, setIsFollowing] = useState();
  const [openProfileCard, setOpenProfileCard] = useState(false);
  const [isAuthModalOpen,setIsAuthModalOpen]=useState(false)
  const { customBlogId } = useParams();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { token, id: userId } = useSelector((state) => state.UserSlice);

  async function getBlog() {

    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000));


      const encodedId = encodeURIComponent(customBlogId);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${encodedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let decodedToken = {};
      if (token) {
        decodedToken = jwtDecode(token);
      }

      if (res?.data?.blog?.desired_blog?.creator?._id == decodedToken.id) {
        setIsOwner(true);
      }

      setBlogData(res?.data?.blog?.desired_blog);
      const isInitiallyFollowed = followingsList.some((one) => {
        return one?.followingId === res?.data?.blog?.desired_blog?.creator?._id;
      });

      setIsFollowing(isInitiallyFollowed);

      SetLikeCount(res?.data?.blog?.desired_blog?.likesCount);
      SetCommentCount(res?.data?.blog?.desired_blog?.commentCount);
      setIsLiked(res?.data?.blog?.isLiked);

      setBlogId(res?.data?.blog?.desired_blog?._id);

     
    } catch (error) {
     
      toast.error(error.response?.data?.message);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getBlog();
  }, [token]);


  async function toggleLike() {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogData._id.toString()}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {}
    setIsLiked((prev) => !prev);
    SetLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  }
  async function handleFollow() {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/follow/${
          blogData?.creator?._id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      if (res?.data?.isFollowed) {
        disptach(
          setFollowingsList([
            ...followingsList,
            { followingId: blogData?.creator?._id },
          ])
        );
      } else {
        const newList = followingsList.filter(
          (item) => item.followingId !== blogData?.creator?._id
        );

        disptach(setFollowingsList(newList));
      }
      setIsFollowing(res?.data?.isFollowed);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  if (loading) {
    return <BlogSkeleton></BlogSkeleton>
    
  }
  return (
    <div className="flex items-center justify-center w-full ">
      <div className="w-[65%] lg:w-[60%] midbreakpoint:w-[80%] maxsixhundread:w-full  min-h-screen p-5 flex flex-col gap-6">
        <div className="w-full flex flex-col gap-4">
          <p className="lg:text-[40px] lg:leading-[50px] midbreakpoint:text-[25px] midbreakpoint:leading-[32px] maxsixhundread:text-xl w-full capitalize text-[30px] font-semibold leading-[40px] mt-5">
            {blogData?.title}
          </p>
          <p className=" midbreakpoint:text-[16px] maxsixhundread:text-sm text-[18px] text-gray-500 font-medium inline-block scale-y-105 transform">
            {blogData?.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {blogData?.tags?.map((one, index) => {
              return (
                <span key={index} className="text-sky-600 whitespace-nowrap">
                  #{one}
                </span>
              );
            })}
          </div>
        </div>
        {/* profile */}
        <div className="w-full mt-5 flex maxsixhundread:flex-col-reverse items-center  maxsixhundread:items-start gap-4 maxsixhundread:gap-2 relative">
          <div className="flex items-center gap-2">
            <div
              onClick={() => {
                navigate(`/@${blogData?.creator?.userName}`);
              }}
              className="maxsixhundread:w-8 maxsixhundread:h-8 w-10 h-10 rounded-full flex-shrink-0"
            >
              {blogData?.creator?.profilePic ? (
                <img
                  className="cursor-pointer w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  src={blogData?.creator?.profilePic}
                  alt=""
                />
              ) : (
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${blogData?.creator?.name}`}
                  alt=""
                />
              )}
            </div>

            <p
              onClick={() => {
                navigate(`/@${blogData?.creator?.userName}`, {
                  state: {
                    id: blogData?.creator?._id,
                  },
                });
              }}
              // onMouseEnter={() => {
              //   setOpenProfileCard(true);
              // }}
              // onMouseLeave={() => {
              //   setOpenProfileCard(false);
              // }}
              className="cursor-pointer text-sm text-black/90 hover:underline font-medium"
            >
              {blogData?.creator?.name}
            </p>
            <div
              onClick={() => {
              

                if (!token) {
                  setIsAuthModalOpen(true)
                  return;
                } else {
                  handleFollow();
                }
              }}
              className="px-4 py-2 rounded-3xl text-sm border font-medium border-gray-800"
            >
              {isfollowing ? "Following" : "Follow"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">13 mins read</p>

            <p className="text-sm text-gray-700">
              {new Date(blogData?.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {openProfileCard && (
            <div className="h-[200px] w-[200px] bg-gray-400 rounded-3xl shadow-lg ">
              hello
            </div>
          )}
        </div>
        {/* comments */}
        <div className="w-full flex items-center gap-5 py-2  border-gray-200 border-t-[1px] border-b-[1px]">
          <div className=" flex gap-2 items-center">
            {isLiked ? (
              <FaHandsClapping
                onClick={() => {

                  if (!token) {
                    setIsAuthModalOpen(true)
                    return
                  }
                  toggleLike();
                }}
              ></FaHandsClapping>
            ) : (
              <PiHandsClapping
                onClick={() => {
                  if (!token) {
                    setIsAuthModalOpen(true)
                    return
                  }
                  toggleLike();
                }}
              ></PiHandsClapping>
            )}
            <p>{likeCount}</p>
          </div>
          <div className=" flex gap-2 items-center">
            <BiCommentDetail
              onClick={() => {
                SetCommentModal((prev) => !prev);
              }}
            ></BiCommentDetail>
            <p>{commentCount}</p>
          </div>

          {isOwner && (
            <LuPencil
              size={16}
              className="text-xl"
              onClick={() => {
                navigate(`/edit/${customBlogId}`);
              }}
            />
          )}
        </div>
        {/* main image */}
        <div className="w-full">
          <img src={blogData?.image} className="w-full" alt="" />
        </div>
        <div>
          <EditorJSRenderer content={blogData?.content}></EditorJSRenderer>
        </div>
      </div>
      <CommentModal
        blogId={blogId}
        SetCommentModal={SetCommentModal}
        isCommentModal={isCommentModal}
        SetCommentCount={SetCommentCount}
      ></CommentModal>
      <AuthModal isAuthModalOpen={isAuthModalOpen} setIsAuthModalOpen={setIsAuthModalOpen}></AuthModal>
    </div>
  );
}

export default BlogPage;
