import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import usePagination from "../hooks/usePagination";
import NoResultsFound from "./NoResultsSearch";

function SearchedBlog() {
  const [searchparams, setSearchParams] = useSearchParams();
  
  
  let {tag}=useParams()
  tag=tag?.replace("-"," ")

  
  const searchQuery = searchparams.get("search");

  
  
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [isLoading,setIsLoading]=useState(true)
  const { blogs, hasMore, setPage,noData, } = usePagination({
    limit: 1,
    searchQuery,
    tag,
    url: `${import.meta.env.VITE_BACKEND_URL}/search-blog`,
    setIsLoading
  });
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
  
  // useEffect(() => {
  //   if (searchQuery) {
  //     handleSearch();
  //   }
  // }, [searchQuery, page]);


  return (
    <div className="w-full ">
    {noData?<NoResultsFound val={searchQuery?searchQuery:tag}></NoResultsFound>:  <div className="w-[80%] lg:w-[60%] mx-auto px-2 maxsixhundread:w-[95%] midbreakpoint:w-[85%]">
        <p className="text-3xl text-gray-700 mt-5 py-5 maxsixhundread:text-xl midbreakpoint:text-2xl">
          Results for <span className="font-semibold">{searchQuery || tag}</span>
        </p>
        <div className="w-full flex flex-col gap-2 maxsixhundread:gap-5 midbreakpoint:gap-3">

          {
            isLoading?
            [1,2,3,4,5].map((one)=>{
              return  <BlogCard isLoading={isLoading} one={one}></BlogCard>
            })
            :blogs?.map((one) => {
              // const isInitiallySaved=savedBlogs.some((oneblog)=>{
              //   return oneblog?.blog===one?._id
              //  })
  
              return <BlogCard isLoading={isLoading} one={one}></BlogCard>;
            })
          }
          {hasMore &&  <button
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
            >
              Load more
            </button>}
        </div>
      </div>}
    </div>
  );
}

export default SearchedBlog;
