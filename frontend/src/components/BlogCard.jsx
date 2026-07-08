import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
import { MdComment } from "react-icons/md";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";

function BlogCard({ one = {}, isInitiallySaved, isLoading, isInitiallyLiked }) {
  

  const { token } = useSelector((slice) => slice.UserSlice);

  const {
    creator,
    title,
    commentCount,
    _id,
    likesCount,
    description,
    createdAt,
    customBlogId,
    image,
  } = one;

  const name = creator?.name || "Unknown";
  const navigate = useNavigate();
  const [isBlogSaved, setisBlogSaved] = useState(isInitiallySaved);

  async function handleSaveBlog(blogId) {
    try {
      let res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/save-blog/${blogId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setisBlogSaved((prev) => !prev);
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex w-full bg-white items-center border-b-[1px] border-gray-200 overflow-hidden animate-pulse">
        {/* Left Section Skeleton - Matches main layout */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-5">
          <div>
            {/* Creator Name Placeholder */}
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          </div>
          <div>
            {/* Title Placeholder */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            {/* Description Placeholders */}
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          {/* Footer Stats Placeholder */}
          <div className="flex items-center justify-start gap-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>

        {/* Right Section - Responsive Image Placeholder (Matches original div exactly) */}
        <div className="right midbreakpoint:w-[128px] midbreakpoint:h-[108px] maxsixhundread:w-[100px] maxsixhundread:h-[80px] h-[200px] w-[300px] py-2 overflow-hidden rounded-xl">
          <div className="h-full w-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        navigate(`/blogs/${customBlogId}`);
      }}
      className={`flex w-full  bg-white items-center  border-b-[1px] border-gray-200   overflow-hidden  transition-shadow duration-500`}
    >
      {/* Left Section */}
      <div className="flex-1 py-5 pr-5 flex flex-col justify-between gap-5 ">
        <div>
          <p className="text-sm text-gray-500">{name}</p>
        </div>
        <div>
          <p className="text-xl font-semibold mb-2 maxsixhundread:text-[16px] midbreakpoint:text-[18px]">
            {title}
          </p>
          <p className="text-gray-600 line-clamp-2  text-justify text-sm maxsixhundread:text-sm maxsixhundread:line-clamp-2">
            {description}
          </p>
        </div>
        <div className=" flex items-center justify-start gap-3 text-[15px] text-gray-500">
          <p className="maxfourfifty:text-sm">
            {new Date(createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <div className="flex  gap-1 justify-center items-center">
            {isInitiallyLiked ? (
              <AiFillLike className="w-5 h-5 font-medium maxfourfifty:w-4 maxfourfifty:h-4" />
            ) : (
              <AiOutlineLike className="w-5 h-5 font-medium maxfourfifty:w-4 maxfourfifty:h-4" />
            )}

            <p className="">{likesCount}</p>
          </div>
          <div className="flex items-center gap-1 justify-center ">
            <MdComment className="w-5 h-5 font-medium maxfourfifty:w-4 maxfourfifty:h-4" />
            <p> {commentCount}</p>
          </div>
          {/* save blog */}

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSaveBlog(_id);
            }}
          >
            {token &&
              (isBlogSaved ? (
                <IoBookmark className="w-5 h-5  maxfourfifty:w-4  maxfourfifty:h-4" />
              ) : (
                <IoBookmarkOutline className="w-5 h-5 maxfourfifty:w-4 maxfourfifty:h-4 " />
              ))}
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="right midbreakpoint:w-[128px] midbreakpoint:h-[108px] maxsixhundread:w-[100px] maxsixhundread:h-[80px] h-[200px] w-[300px] py-2 overflow-hidden rounded-xl">
        <img
          className="h-full w-full object-cover "
          src={image || "/placeholder.jpg"}
          alt={title}
        />
      </div>
    </div>
  );
}

export default BlogCard;