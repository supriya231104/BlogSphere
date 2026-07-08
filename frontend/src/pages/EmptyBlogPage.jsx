import React from 'react';
import { Heart, Bookmark, FileText, BookOpen, User, PlusCircle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EmptyBlogPage = ({ type,userName }) => {
  const navigate = useNavigate();
  const {id } = useSelector((state) => state.UserSlice);
  // Mapping profile nav items to their respective empty states
  const config = {
    "Home": {
      icon: <BookOpen size={28} className="text-emerald-500 maxfourfifty:w-5 maxfourfifty:h-5 " strokeWidth={1.5} />,
      title: "No stories published yet",
      description: "You haven’t published any public stories on your profile. Share your thoughts with the world.",
      buttonText: "Write your first story",
      buttonIcon: <PlusCircle size={16} />,
      path:"/add-blog",
      action: () => navigate('/create-blog') // Apne create blog page ka route check kar lena
    },
    "Saved": {
      icon: <Bookmark size={28} className="text-blue-500 maxfourfifty:w-5 maxfourfifty:h-5 " strokeWidth={1.5} />,
      title: "Your reading list is empty",
      description: "Save stories you want to read later, reference often, or keep as personal favorites. They’ll all live right here.",
      buttonText: "Browse top stories",
      buttonIcon: <Compass size={16} />,
       path:"/",
      action: () => navigate('/')
    },
    "Liked": {
      icon: <Heart size={28} className="text-rose-500 maxfourfifty:w-5 maxfourfifty:h-5 " strokeWidth={1.5} />,
      title: "You haven’t liked any stories yet",
      description: "When you find a story that moves you or teaches you something new, give it a like to appreciate the author.",
      buttonText: "Explore articles",
      buttonIcon: <Compass size={16} />,
      path:"/",
      action: () => navigate('/')
    },
    "Draft": {
      icon: <FileText size={28} className="text-amber-500 maxfourfifty:w-5 maxfourfifty:h-5 " strokeWidth={1.5} />,
      title: "No drafts found",
      description: "Have an idea brewing in your mind? Start writing today. Your drafts will be automatically saved right here.",
      buttonText: "Create a draft",
      buttonIcon: <PlusCircle size={16} />,
      path:"/add-blog",
      action: () => navigate('/add-blog')
    },
    "About": {
      icon: <User size={28} className="text-purple-500 maxfourfifty:w-5 maxfourfifty:h-5 " strokeWidth={1.5} />,
      title: "Tell your readers about yourself",
      description: "Your about section is currently blank. Add a detailed bio, share your expertise, or add links to your social media profiles.",
      buttonText: "Update profile bio",
      buttonIcon: <PlusCircle size={16} />,
      action: () => navigate(`/edit-profile/${userName}`,{
        state:{
          id
        }
      })
    }
  };

  // Fallback if any custom tag mismatch happens
  const current = config[type] || config["Home"];

  return (
    <div className="w-full max-w-md mx-auto my-12 px-6 text-center py-10 border border-gray-100 rounded-2xl bg-gray-50/30 maxfourfifty:bg-white maxfourfifty:border-none backdrop-blur-sm">
      {/* Dynamic Colored Icon */}
      <div className="flex justify-center mb-5">
        <div className="p-3.5 maxfourfifty:p-3 bg-white shadow-sm rounded-full border border-gray-100">
          {current.icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-serif font-medium text-gray-950 mb-2.5">
        {current.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 font-sans text-sm leading-relaxed mb-6">
        {current.description}
      </p>

      {/* Dynamic Action Button */}
      <button
        onClick={current.action}
        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-xs md:text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm"
      >
        {current.buttonIcon}
        {current.buttonText}
      </button>
    </div>
  );
};

export default EmptyBlogPage;