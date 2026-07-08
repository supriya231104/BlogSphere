import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function usePagination({ searchQuery,tag, limit, url,setIsLoading }) {

 
  const navigate=useNavigate()
  const [blogs, SetBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [noData,SetIsNoData]=useState(false)
  async function fetchBlogs() {
    try {
      SetIsNoData(false)
      const params = { searchQuery,tag, page, limit };
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await axios.get(url, { params });
      if (!res?.data?.success) {
       SetIsNoData(true)
       return
        
      }
      

      SetBlogs((prev) => [...prev, ...res.data.blogs]);
      setIsLoading(false)
      
     
      setHasMore(res?.data?.hasMore);

    } catch (error) {
     
      toast.error(error.response?.data?.message || "Error fetching blogs");
    }
  }
  useEffect(() => {
   
    fetchBlogs();
    
  }, [page]);
  useEffect(() => {
    SetBlogs([]);
   
    
    if (page !== 1) {
      setPage(1);
    } 
   
   
  }, [searchQuery]);

  return { blogs, hasMore, setPage,noData };
}

export default usePagination;
