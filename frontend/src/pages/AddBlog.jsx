import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useSelector } from "react-redux";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import RawTool from "@editorjs/raw";
import { X } from "lucide-react";
import { MdOutlinePreview } from "react-icons/md";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import EditorJSRenderer from "../components/EditorJsRenderer";

function AddBlog() {
  let { customBlogId } = useParams();
  const [isBlogFound, setBlogFound] = useState(false);
  const location = useLocation();
  const readyblogData = location?.state;
  const { token, email, id } = useSelector((slices) => slices.UserSlice);

  const [preview, setIsPreview] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef();
  const [previewUrl, setPreviewUrl] = useState("");
  const [blogContent, setBlogContent] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content: null,
    draft: false,
    tags: new Set(),
  });

  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current?.destroy) {
      editorRef.current.destroy();
    }
    if (!document.getElementById("editorjs")) return;

    editorRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "Write something here ...",
      data: blogData.content || {
        blocks: [],
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a heading",
            levels: [2, 3, 4],
            default: 3,
          },
        },
        list: {
          class: EditorjsList,
          inlineToolbar: true,
        },
        rawcode: {
          class: RawTool,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },

        embed: Embed,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (image) => {
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(image),
                    image,
                  },
                };
              },
            },
          },
        },
      },
    });
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [blogData.content]);
  useEffect(() => {
    if (!blogData.image) return;

    const preview = URL.createObjectURL(blogData.image);

    setPreviewUrl(preview);

    return () => URL.revokeObjectURL(preview);
  }, [blogData.image]);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token]);
  useEffect(() => {
    if (customBlogId) {
      if (readyblogData) {
        rehydrateBlogData();
      } else getBlog();
    }
  }, [customBlogId]);

  function rehydrateBlogData() {
    setBlogFound(true);
    setBlogData({
      title: readyblogData?.title,
      description: readyblogData?.description,
      content: readyblogData?.content,
      draft: res?.data?.blog?.desired_blog?.draft,
      tags: new Set(res?.data?.blog?.desired_blog?.tags),
    });
    setPreviewUrl(readyblogData?.image);
  }
  async function getBlog() {
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${customBlogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
   
      setBlogFound(true);
    
      setBlogData({
        title: res?.data?.blog?.desired_blog?.title,
        description: res?.data?.blog?.desired_blog?.description,
        content: res?.data?.blog?.desired_blog?.content,
        draft: res?.data?.blog?.desired_blog?.draft,
        tags: new Set(res?.data?.blog?.desired_blog?.tags),
      });
      setPreviewUrl(res?.data?.blog?.desired_blog?.image);

      toast.success("Blog fetched successfully");
    } catch (error) {
    
      toast.error(error.response.data.message);
      //  customBlogId: "the-2026-capsule-wardrobe:-7-items-kendall-jenner-owns--4myqlc15wmnhadw8n"
    }
  }
  function handleOnChange(e) {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e) {
    setBlogData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  }

  async function handlePostBlog(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("image", blogData.image);
      formData.append("tags", JSON.stringify([...blogData.tags]));
      formData.append("draft", blogData?.draft);
      await editorRef.current.isReady;
      const content = await editorRef.current.save();
   
      formData.append("content", JSON.stringify(content));
      

      let images = [];
      content.blocks.forEach((oneBlock) => {
        // images.push(oneBlock?.data?.file?.image)
        if (oneBlock?.type === "image") {
          formData.append("images", oneBlock?.data?.file?.image);
        }
      });
      

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

  
      if (blogData?.draft) {
        toast.success("Blog saved as draft successfully 🚀");
      } else {
        toast.success("Blog created successfully 🚀");
      }
      setBlogData({
        title: "",
        description: "",
        image: null,
        content: null,
        draft: false,
        tags: new Set(),
      });
      setBlogContent([])
      fileRef.current.value = null;
      setPreviewUrl("");
      await editorRef.current.clear();

      // navigate('/')
    } catch (error) {
    
      toast.error(error.response?.data?.message);
    }
  }
  async function handleUpdateBlog(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("image", blogData.image);
      formData.append("tags", JSON.stringify([...blogData.tags]));
      formData.append("draft", blogData?.draft);
      const content = await editorRef.current.save();

      formData.append("content", JSON.stringify(content));

      const existingImages = [];
      content.blocks.forEach((oneBlock) => {
        if (oneBlock?.type === "image") {
          if (oneBlock?.data?.file?.image) {
            formData.append("images", oneBlock?.data?.file?.image);
          } else {
            existingImages.push({
              url: oneBlock?.data?.file?.url,
              imageId: oneBlock?.data?.file?.imageId,
            });
          }
        }
      });
      formData.append("existingImages", JSON.stringify(existingImages));
      
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${customBlogId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (blogData?.draft) {
        toast.success("Blog saved as draft successfully 🚀");
      } else {
        toast.success("Blog updated successfully 🚀");
      }

      
      setBlogData({
        title: "",
        description: "",
        image: null,
        content: null,
        draft: false,
        tags: new Set(),
      });
      setBlogContent([])
      fileRef.current.value = null;
      setPreviewUrl("");

      navigate("/");
    } catch (error) {
      
      toast.error(error.response?.data?.message);
    }
  }

  return customBlogId && !isBlogFound ? (
    <h1>Oops Blog not found try again</h1>
  ) : (
    <div className="relative flex items-center justify-center  p-1 w-[70%] lg:w-[55%] h-fit group my-10 maxsixhundread:w-full midbreakpoint:w-[85%] ">
      <form
        onSubmit={customBlogId ? handleUpdateBlog : handlePostBlog}
        className=" h-full bg-gray-100/20 shadow-lg rounded-lg p-8 maxsixhundread:px-4 w-full flex flex-col items-center group-hover:border group-hover:border-gray-200/50 transition-border duration-150 maxsixhundread:shadow-none maxsixhundread:border-none maxsixhundread:bg-white maxsixhundread:gap-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 maxsixhundread:text-xl">
          {customBlogId ? "Edit Blog" : "Add New Blog"}
        </h2>
        <div
          onClick={async () => {
            const val = await editorRef.current.save();
            setBlogContent(val);
            setIsPreview((prev)=>{
              return !prev
            });
          }}
          className="absolute top-5 right-5 "
        >
          <MdOutlinePreview size={20} />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="title" className="block mb-2 font-semibold maxsixhundread:text-sm">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={blogData.title}
            onChange={handleOnChange}
            className="w-full p-3 border rounded-lg maxsixhundread:text-gray-800 maxsixhundread:text-sm maxsixhundread:text-wrap"
          />
        </div>
        <div className="mb-4 w-full ">
          <label htmlFor="tag" className="block mb-2 font-semibold maxsixhundread:text-sm">Tags</label>
          <div className="flex flex-col gap-2">
            <input
            id="tag"
              type="text"
              name="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full p-3 border rounded-lg maxsixhundread:text-gray-800 maxsixhundread:text-sm maxsixhundread:text-wrap"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  const val = tagInput.trim().toLowerCase();
                  if (!val) {
                    return;
                  }
                  if (10 - blogData?.tags?.size <= 0) {
                    toast.error("Tags limit exceeded");
                    return;
                  }
                  setBlogData((prev) => {
                    return { ...prev, tags: new Set([...prev.tags, val]) };
                  });
                  setTagInput("");
                }
              }}
            />
            <div className="w-full flex items-center justify-between">
              <p className="text-sm text-gray-500">*Hit enter to add tags</p>
              <p className="text-sm text-gray-500">
                {10 - (blogData?.tags?.size || 0)} tags remaining
              </p>
            </div>
            <div className="flex w-full items-center gap-4 my-3 flex-wrap">
              {[...blogData?.tags]?.map((one) => {
                return (
                  <div className="maxsixhundread:px-2 maxsixhundread:py-1 maxsixhundread:text-xs flex gap-2 items-center justify-center  px-4 py-[5px] rounded-2xl bg-gray-200">
                    <p>{one}</p>
                    <div
                      onClick={() => {
                        setBlogData((prev) => {
                          const newSet = new Set(prev.tags);

                          newSet.delete(one);
                          return { ...prev, tags: newSet };
                        });
                      }}
                      className="h-4 w-4 flex items-center justify-center  bg-black/90 rounded-full cursor-pointer"
                    >
                      <X size={14} className="text-white"></X>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mb-4 w-full flex flex-col gap-2 items-start">
          <label className="block mb-2 font-semibold maxsixhundread:text-sm" htmlFor="draft">
            Draft
          </label>
          <select
            onChange={(e) => {
              setBlogData((prev) => {
               
                return {
                  ...prev,
                  ["draft"]: e.target.value === "true" ? true : false,
                };
              });
            }}
            name="draft"
            id="draft"
            value={blogData?.draft}
          >
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        </div>

        <div className="mb-4 w-full">
          <label htmlFor="description" className="block mb-2 font-semibold maxsixhundread:text-sm">Description</label>
          <textarea
            name="description"
            value={blogData.description}
            onChange={handleOnChange}
            className="w-full p-5 border rounded-lg maxsixhundread:min-h-[40px] maxsixhundread:text-gray-800 maxsixhundread:text-sm maxsixhundread:text-wrap"
            rows={10}
            id="description"
          />
        </div>

        <div className="mb-6 w-full flex flex-col ">
          <label htmlFor="file" className="flex items-center justify-center mb-2 font-semibold w-full">
            {previewUrl ? (
              <img className="  w-full" src={previewUrl} alt="" />
            ) : (
              <div 
              className="bg-slate-600 text-white px-5 py-2 rounded-3xl w-[30%] midbreakpoint:w-[60%] maxsixhundread:w-[80%] flex items-center justify-center whitespace-nowrap"
            >
              Upload Image
            </div>
            )}
          </label>
          <input
            ref={fileRef}
            id="file"
            type="file"
            onChange={handleFileChange}
            className="w-full hidden"
          />
        </div>
        <div id="editorjs" className={`w-full ${preview?'hidden':'block'}`}></div>
        <div className={`w-full ${preview?'block':'hidden'}`}>
          <EditorJSRenderer  content={blogContent}></EditorJSRenderer>
        </div>
        <button
  type="submit"
  className="bg-green-500 text-white px-6 py-2 rounded-3xl base-flex-center w-[30%] midbreakpoint:w-[60%] maxsixhundread:w-[80%] flex items-center justify-center"
>
  {blogData?.draft
    ? "Save as draft"
    : customBlogId
    ? "Edit Blog"
    : "Submit Blog"}
</button>
      </form>
    </div>
  );
}

export default AddBlog;
// customBlogId: "the-2026-capsule-wardrobe:-7-items-kendall-jenner-owns--4myqlc15wmnhadw8n"
