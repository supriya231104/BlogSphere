import React, { useState } from "react";

export default function AboutMePage({ userData, followerCount }) {
  const blogCount = userData?.blogs?.length || 0;

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-8 maxsixhundread:px-3">
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
        {/* Profile Image */}

        {/* Identity & Bio */}
        <div className="flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-gray-900 maxsixhundread:text-[16px]">
              {userData.name}
            </h1>
            {userData.verify && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-mono">
            @{userData.userName}
          </p>
          <p className="mt-3 text-gray-700 text-base italic maxsixhundread:text-[12px]">
            "{userData.bio}"
          </p>

          {/* Quick Stats Metrics */}
          <div className="mt-5 flex justify-center items-center sm:justify-start gap-6 text-sm text-gray-600 border-t border-gray-50 pt-4">
            <div>
              <span className="font-bold text-gray-900 ">{blogCount}</span>
              <p className="maxsixhundread:text-[12px]">Blogs Published</p>
            </div>
            <div>
              <span className="font-bold text-gray-900 ">{followerCount}</span>
              <p className="maxsixhundread:text-[12px]">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
