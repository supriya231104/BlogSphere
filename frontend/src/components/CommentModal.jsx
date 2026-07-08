import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import SingleComment from "./SingleComment";
import { FaRegUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AuthModal from "../utils/AuthModal";
function CommentModal({
  isCommentModal,
  SetCommentModal,
  blogId,
  SetCommentCount,
}) {
  if (!isCommentModal || !blogId) {
    return;
  }

  const { token, id, photoURL, name } = useSelector((state) => state.UserSlice);
  const [userInfo, setUserInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [inputComment, setInputComment] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [isAuthModalOpen,setIsAuthModalOpen]=useState(false)

  async function handlePostComment() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comments`,
        {
          comment: inputComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      SetCommentCount((prev) => prev + 1);
     

      let comment = res?.data?.comment;
      setComments((prev) => {
        return [comment, ...prev];
      });
      setInputComment("");
    } catch (error) {
      toast.error("Error in creating comment");
    }
  }

  async function getData() {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comments`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let userres = {};
    if (id) {
      userres = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setComments(res?.data?.comments);

    setUserInfo(userres?.data?.user);
  }
  useEffect(() => {
    getData();
  }, [blogId]);

  return (
    <div
      onClick={() => {
        SetCommentModal(false);
      }}
      className="fixed inset-0  bg-[#ffffff25]   z-[10000] "
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute  maxsixhundread:w-[90%] midbreakpoint:w-[50%] lg:w-[30%]  w-[33%] flex flex-col justify-start py-8 px-5 bg-white h-full z-[10001] overflow-y-scroll   top-0 right-0 transform gap-3  "
      >
        {/* //first */}
        <div className="flex items-center justify-between px-3 pb-3  border-b-[1px] border-gray-300">
          <p className="text-xl font-semibold">Responses ({comments.length})</p>
          <X
            onClick={() => {
              SetCommentModal(false);
            }}
            className="font-thin text-gray-400"
          ></X>
        </div>
        {/* second */}
        <div className="py-4 px-2 flex items-center justify-start gap-3">
          <div className="w-8 h-8 ">
            {token ? (
              photoURL ? (
                <img
                  className="w-full h-full object-cover  rounded-full"
                  referrerPolicy="no-referrer"
                  src={`${photoURL}`}
                  alt=""
                />
              ) : (
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${userInfo?.name}`}
                  alt=""
                />
              )
            ) : (
              <div className="bg-gray-200/50 w-8 h-8 rounded-full flex items-center justify-center">
                <FaRegUser className="font-thin  text-gray-800" />
              </div>
            )}
          </div>
          <p className="maxsixhundread:text-sm text-[16px] font-medium">
            {name}
          </p>
        </div>
        {/* third */}
        <div
          onClick={() => {
            setIsCollapsed(false);
          }}
          className="bg-[#ffffffec] shadow-sm px-3 py-3 flex flex-col gap-5 rounded-xl"
        >
          <textarea
            onChange={(e) => {
              setIsAuthModalOpen(false)
              setInputComment(e.target.value);
            }}
            rows={isCollapsed ? 1 : 5}
            className="text-[16px] maxsixhundread:text-sm w-full scrollbar-hide overflow-y-auto resize-none py-2 px-3 bg-transparent  focus:outline-none rounded-xl"
            name=""
            value={inputComment}
            id=""
            placeholder="What are your thoughts?"
          ></textarea>
          <div
            className={`w-full  items-center gap-3 ${
              isCollapsed ? "hidden" : "flex"
            }`}
          >
            <button
              onClick={() => {
                setIsCollapsed(true);
              }}
              className={`maxsixhundread:text-[12px] text-[16px] flex items-center justify-center text-sm px-4 py-[6px] rounded-3xl bg-gray-200`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!token) {
                  setIsAuthModalOpen(true)
                } else handlePostComment();
              }}
              className={`maxsixhundread:text-[12px] text-[16px] flex items-center justify-center text-sm px-4 py-[6px] rounded-3xl ${
                inputComment ? "text-white bg-black" : "bg-gray-200"
              }`}
            >
              Respond
            </button>
          </div>
        </div>
        {/* fouth */}
        <div className="bg-white w-full flex flex-col items-center gap-3">
          {comments?.map((data, i) => {
            const lastEle = i == comments.length - 1;
            return (
              <SingleComment
              isAuthModalOpen={isAuthModalOpen}
              setIsAuthModalOpen={setIsAuthModalOpen}
                lastEle={lastEle}
                depth={0}
                key={data._id}
                data={data}
                blogId={blogId}
                SetCommentCount={SetCommentCount}
                setComments={setComments}
              ></SingleComment>
            );
          })}
        </div>
      </div>
      <AuthModal isAuthModalOpen={isAuthModalOpen} setIsAuthModalOpen={setIsAuthModalOpen}></AuthModal>
    </div>

  );
}

export default CommentModal;
