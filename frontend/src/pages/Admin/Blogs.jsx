import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { mockBlogs, mockStats } from "./data/mockData";

const statusColors = {
  published: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  flagged: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-500",
};

export default function AdminBlogs() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = mockBlogs.filter((b) => activeTab === "all" || b.status === activeTab);

  return (
    <AdminLayout title="Blog Management">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Blog Management</h2>
          <p className="text-gray-400 mt-1">Health content moderation and publishing</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#7B2D8B] text-white rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-sm">edit</span>
          Create New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-[#7B2D8B] mb-3 block">article</span>
          <p className="text-3xl font-black text-gray-800">284</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Published Posts</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">pending</span>
          <p className="text-3xl font-black text-amber-600">{mockStats.pendingBlogs}</p>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-1">Pending Review</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-red-500 mb-3 block">flag</span>
          <p className="text-3xl font-black text-red-600">3</p>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mt-1">Flagged Content</p>
        </div>
      </div>

      {/* Flagged Alert */}
      {(activeTab === "all" || activeTab === "flagged") && mockBlogs.some(b => b.status === "flagged") && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600">warning</span>
          <p className="text-sm font-semibold text-red-700">3 posts require immediate review — potential misinformation detected.</p>
        </div>
      )}

      {/* Blog Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "pending", "published", "flagged", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? "bg-[#7B2D8B] text-white" : "text-gray-400 hover:bg-[#fdf0f9]"
              }`}
            >
              {tab === "all" ? "All Posts" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">check_circle</span>
              <p className="text-gray-400 font-medium">No posts in this category.</p>
            </div>
          ) : (
            filtered.map((blog) => (              <div key={blog.id} className="bg-[#fdf0f9] rounded-2xl p-5 flex flex-col gap-3">
                {/* Cover placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-[#7B2D8B]/20 to-[#600f72]/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#7B2D8B]/30">article</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-white text-[#7B2D8B] text-xs font-bold rounded-full">{blog.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[blog.status]}`}>{blog.status}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm leading-snug">{blog.title}</h4>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#7B2D8B] flex items-center justify-center text-white text-xs font-bold">
                    {blog.author[0]}
                  </div>
                  <p className="text-xs text-gray-400">{blog.author} · {blog.date}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    {blog.likes.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-[#7B2D8B] hover:bg-white rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-white rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    {blog.status === "pending" && (
                      <button className="p-1.5 text-emerald-600 hover:bg-white rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </button>
                    )}
                    <button className="p-1.5 text-red-500 hover:bg-white rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
