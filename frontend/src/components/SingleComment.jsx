import React, { use, useState } from "react";
import { MoreHorizontal, ThumbsUp, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthModal from "../utils/AuthModal";

function SingleComment({ lastEle,data, blogId, SetCommentCount, setComments, depth,isAuthModalOpen,setIsAuthModalOpen }) {
  
  
  const { token, id } = useSelector((state) => state.UserSlice);
  const { user, comment, createdAt, likes, isOwner } = data;
 const navigate=useNavigate()
  
  const [commentLikes, setCommentsLike] = useState(data?.likes?.length);
  const [showPop, setShowPop] = useState(false);
  const [isLiked, setIsLiked] = useState(data.isLiked);
  const [isEdit, setIsEdit] = useState(false);
  const [editText, setEditText] = useState(data.comment);
  const [isReply, setIsReply] = useState(false);
  const [replyText, SetReplyText] = useState("");
  const [replies,setReplies]=useState([])
  const [showReplies,setShowReplies]=useState(true)
  const [replyCount,setReplyCount]=useState(data?.replyCount)

  
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  async function handleDeleteComment() {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comments/${
          data?._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPop(false);
      setComments((comments) => {
        const new_comments = comments.filter((comment) => {
          return comment._id !== data._id;
        });
        SetCommentCount(new_comments.length);

        return new_comments;
      });

      toast.success("comment deleted successfully");
    } catch (error) {
      toast.error("comment deletion failed");
    }
  }
  async function getReplies() {
       try {
        const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comments/${data?._id}/replies`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
       
        setReplies(res?.data?.comments)
       
      } catch (error) {
         toast.error(`${error?.response?.data?.message}`)
       }
    
  }
  async function handleLikeOnComment() {
    try {
      let res;
      if (!isLiked) {
        res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/blogs/${blogId}/comments/${data._id.toString()}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLiked(true);

        setCommentsLike((prev) => {
          return prev + 1;
        });
      } else {
        res = await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/blogs/${blogId}/comments/${data._id.toString()}/dislike`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLiked(false);
        setCommentsLike((prev) => {
          return prev - 1;
        });
      }

     
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function handleEditComment() {
    try {
      if (!editText.trim()) {
   
        setEditText((prev) => {
          if (!prev) {
            return data.comment;
          } else {
            return prev;
          }
        });
        return;
      }
      const res = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/blogs/${blogId}/comments/${data._id.toString()}`,
        {
          comment: editText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
     
      setShowPop(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function handlePostComment() {
   try {
    let res = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/blogs/${blogId}/comments/${data._id.toString()}/replies`,
      {
        reply: replyText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
   
    setReplyCount((prev)=>prev+1)
    setReplies((prev)=>[...prev,res?.data?.comment])
    SetReplyText("")
    setIsReply(false)
   
  } catch (error) {
     toast.error(`${error?.response?.data?.message}`)
    
    
   }
  }

  return (
    <div
    
      onClick={() => {
        setShowPop(false);
      }}
      style={{marginLeft:`${depth<2?depth*24:0}px`}}
      className={`maxsixhundread:py-4 border-l-2 px-3 py-7 w-full  border-gray-100 flex flex-col gap-3 group relative ${(replies.length>0)?'border-b-[1px]':''}`}
    >
      
      <div className="w-full flex flex-col items-start relative gap-3 ">
        {/* Header: User Info & Actions */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-5">
          {/* Avatar - Using first letter as fallback */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
                alt=""
              />
            )}
          </div>

          {/* Name and Date */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 className="maxfourfifty:text-[12px] text-sm font-semibold text-gray-900 cursor-pointer hover:underline">
                {user?.name}
              </h4>
              {/* Optional: Add "Author" tag if user._id === blog.authorId */}
            </div>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {/* Triple dot menu for actions */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPop((prev) => {
              return !prev;
            });
          }}
          className="text-gray-400 hover:text-black transition-colors "
        >
          <MoreHorizontal size={18} />
          
        </button>
      </div>

      {/* Comment Body */}
      <div className="pl-0 md:pl-11 w-full">
        {isEdit ? (
          <textarea
            onChange={(e) => {
              setEditText(e.target.value);
            }}
            type="text"
            value={editText}
            rows={3}
            className="maxsixhundread:text-[12px] text-[16px]  w-full scrollbar-hide overflow-y-auto resize-none py-2 px-3 bg-gray-200/80  focus:outline-none rounded-xl"
          />
        ) : (
          <p  className="text-[15px] maxsixhundread:text-[12px]  leading-relaxed text-gray-800 whitespace-pre-line  ">
            {editText}
          </p>
        )}
      </div>

      {/* Footer: Interaction Buttons */}
      <div className="pl-0 md:pl-11 flex items-center gap-8 maxfourfifty:gap-5 mt-1 text-gray-500">
        <button className="flex items-center gap-1.5 text-xs hover:text-black transition-colors group">
          <ThumbsUp
            onClick={()=>{
              if (!token) {
               setIsAuthModalOpen(true)
                
              }
              else{
                handleLikeOnComment()
              }
            }}
            size={16}
            className={`group-hover:scale-110 transition-transform ${
              isLiked && "fill-black"
            }`}
          />
          <span>{commentLikes}</span>
        </button>

        {

          replyCount>0&&<div className="flex items-center gap-1 text-xs cursor-pointer">
            <button className="flex items-center gap-1 text-xs hover:text-black transition-colors">
              <MessageCircle size={16} />
            </button>
            <div onClick={()=>{
              if (showReplies) {
                getReplies()
                
              }
              else{
                setReplies([])
              }
              setShowReplies((prev)=>!prev)

            }} className="flex items-center gap-1">
              <p>{showReplies?replyCount:''}</p>
             
              <span>{showReplies?(replyCount>1?'Replies':'Reply'):'Hide Replies'}</span>
            </div>
          </div>
        }
        <p
          onClick={() => {
            setIsReply((prev) => !prev);
          }}
          className="text-xs text-gray-900 underline cursor-pointer"
        >
          Reply
        </p>
      </div>
      {showPop &&
        (isOwner ? (
          <div className="absolute right-0 top-[50%] -translate-y-[50%] flex flex-col gap-2 items-center">
            <div
              onClick={async () => {
                if (isEdit) {
                  await handleEditComment();
                }

                setIsEdit((prev) => {
                  return !prev;
                });
              }}
              className="px-5 py-2 text-sm  text-red-500 bg-white shadow-md"
            >
              Edit
            </div>
            <div
              onClick={handleDeleteComment}
              className="px-5 py-2 text-sm  text-red-500 bg-white shadow-md"
            >
              Delete
            </div>
          </div>
        ) : (
          <div className="absolute right-0 top-[50%] -translate-y-[50%]">
            <div className="px-5 py-2  text-sm text-red-500 bg-white shadow-md">Report</div>
          </div>
        ))}
      </div>
     <div>
     {isReply && (
        <div className="text-sm bg-[#ffffffec] shadow-sm px-3 py-3 flex flex-col gap-5 rounded-xl ml-10 mt-3">
          <textarea
            className="text-sm maxsixhundread:text-[12px] w-full scrollbar-hide overflow-y-auto resize-none py-2 px-3 bg-transparent  focus:outline-none rounded-xl"
            name=""
            id=""
            value={replyText}
            placeholder={`Replying to ${user?.name}`}
            onChange={(e) => {
              setIsAuthModalOpen(false)
              SetReplyText(e.target.value);
            }}
            rows={5}
          ></textarea>
          <div className={`w-full flex items-center gap-3`}>
            <button
              className={`maxsixhundread:text-[12px] flex items-center justify-center text-sm px-4 py-[6px] rounded-3xl bg-gray-200`}
            >
              Cancel
            </button>
            <button
              onClick={()=>{
                if (!token) {
              
                  setIsAuthModalOpen(true)
                }
                else{
                  handlePostComment()
                }
              }}
              className={`maxsixhundread:text-[12px] flex items-center justify-center text-sm px-4 py-[6px] rounded-3xl ${
                replyText ? "bg-black text-white" : "bg-gray-200"
              } `}
            >
              Respond
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-start gap-3">
      {
        replies?.map((reply,i)=>{
        
         
          return <SingleComment key={reply?._id} data={reply} blogId={blogId} SetCommentCount={SetCommentCount} setComments={setComments} depth={depth+1} isAuthModalOpen={isAuthModalOpen} setIsAuthModalOpen={setIsAuthModalOpen} ></SingleComment>

        })
      }
      </div>
     </div>
     
    </div>
    
  );
}

export default SingleComment;
