import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import { setFollowingsList } from "../utils/UserSlice";
import usePagination from "../hooks/usePagination";
import { X } from "lucide-react";
function HomePage() {
  const [savedBlogs, setSavedBlogs] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { token, id } = useSelector((slice) => slice.UserSlice);
  const disptach = useDispatch();
  const [showWritingCard, setShowWritingCard] = useState(true);
  const [listOfLikedBlogs, setListOfLikedBlogs] = useState([]);
  const { blogs, hasMore, setPage } = usePagination({
    limit: 5,
    url: `${import.meta.env.VITE_BACKEND_URL}/blogs`,
    setIsLoading,
  });

  async function getFollowings() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/follow/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res?.data?.message);
      disptach(setFollowingsList(res?.data?.follwings));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  async function fetchSavedBlogs() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/saved-blogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedBlogs(res.data.blogs);

      toast.success("Saved Blogs fetched");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching saved blogs"
      );
    }
  }
  function handleWriting() {
    if (token) {
      navigate("/add-blog");
    } else {
      navigate("/signup");
    }
  }
  async function getLikedBlogId() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/liked-blogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListOfLikedBlogs(res?.data?.blogs);

      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    if (token) {
      fetchSavedBlogs();
      getFollowings();
      getLikedBlogId();
    }
  }, []);

  return (
    <div className="lg:w-[75%] w-[85%] maxlg:flex-col-reverse maxsixhundread:w-full maxsixhundread:px-5 flex  maxsixhundread:flex-col-reverse midbreakpoint:flex-col-reverse midbreakpoint:w-full midbreakpoint:px-5  mx-auto   gap-10 py-10 items-start ">
      <div className="flex-grow items-center  left  flex flex-col maxfourfifty:gap-5 midbreakpoint:gap-3 ">
        {isLoading
          ? [1, 2, 3, 4, 5].map((num) => (
              <BlogCard key={num} isLoading={true} one={{}} />
            ))
          : blogs?.map((one, index) => {
              const isInitiallySaved = savedBlogs.some((oneblog) => {
                return oneblog?.blog === one?._id;
              });
              const isInitiallyLiked = listOfLikedBlogs.some((oneblog) => {
                return oneblog === one?._id;
              });
              return (
                <BlogCard
                  isLoading={isLoading}
                  key={one?._id}
                  one={one}
                  isInitiallyLiked={isInitiallyLiked}
                  isInitiallySaved={isInitiallySaved}
                ></BlogCard>
              );
            })}
        {hasMore && (
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
            className="px-5 rounded-lg bg-blue-600 text-white py-2 "
          >
            Load more
          </button>
        )}
      </div>
      <div className="right flex flex-col gap-8 px-3 ">
        <p className="text-gray-900 font-medium">Recommended topics</p>
        <div className="flex items-center gap-2 flex-wrap w-full">
          {[
            "React js",
            "Node js",
            "Bun js",
            "Artificial general Intelligence",
            "Next js v15",
            "JavaScript",
            "llm applications",
          ].map((one, index) => {
            return (
              <Link
                key={index}
                to={`/tags/${one.toLowerCase().replace(" ", "-")}`}
              >
                <div className="cursor-pointer py-1 text-sm px-3 rounded-3xl bg-gray-100 flex items-center justify-center">
                  <span className="">{one}</span>
                </div>
              </Link>
            );
          })}
        </div>
        {showWritingCard && (
          <div className="w-[300px] maxfourfifty:w-[250px] maxfourfifty:h-[220px]  relative h-[250px] px-4 bg-sky-100 flex flex-col gap-3 py-5 items-start justify-center ">
            <p className="font-bold maxfourfifty:text-sm">Writing on BlogSphere </p>
            <p className="text-sm">Join our BlogSphere Writing 101 Webinar</p>
            <p className="text-sm">Read BlogSphere tips & tricks</p>
            <p className="text-sm">Get practical Medium writing advice</p>
            <div
              onClick={handleWriting}
              className="cursor-pointer text-xs bg-black rounded-3xl px-3 py-2 text-white"
            >
              Start Writing
            </div>
            <X
              onClick={() => {
                setShowWritingCard(false);
              }}
              className="cursor-pointer absolute top-4 right-3"
              size={16}
            ></X>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
