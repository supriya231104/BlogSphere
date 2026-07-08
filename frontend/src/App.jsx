import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import { setUserInfoOnReload } from "./utils/setUserInfoOnReload.jsx";
import { useDispatch } from "react-redux";
import VerifyUser from "./components/VerifyUser.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import EditProfilePage from "./components/EditProfilePage.jsx";
import SearchedBlog from "./pages/SearchedBlog.jsx";
import NoResultsFound from "./pages/NoResultsSearch.jsx";


// dhekanesupriya7_db_user
// 2JiOWi7XkytdbB18
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setUserInfoOnReload(dispatch);
  }, []);

  return (
    <div className="w-full">
      <Toaster />
      {/* w-full lagaya aur ensure kiya ki koi overflow-hidden parent layout me na ho */}
      <div className="min-h-screen w-full flex flex-col items-center relative">
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<AuthForm type={"signin"} />} />
            <Route path="/signup" element={<AuthForm type={"signup"} />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/blogs/:customBlogId" element={<BlogPage />} />
            <Route path="/edit/:customBlogId" element={<AddBlog />} />
            <Route path="/verify-email/:verificationToken" element={<VerifyUser />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="/edit-profile/:username" element={<EditProfilePage />} />
            <Route path="/search" element={<SearchedBlog />} />
            <Route path="/tags/:tag" element={<SearchedBlog />} />
            <Route path="/no-result" element={<NoResultsFound />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;