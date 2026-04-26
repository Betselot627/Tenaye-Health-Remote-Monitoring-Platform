import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { mockBlogs, mockStats } from "./data/mockData";

const statusColors = {
  published: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  flagged: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-500",
};

function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-600" : "bg-[#7B2D8B]"}`}>
      <span className="material-symbols-outlined text-lg">
        {type === "success" ? "check_circle" : type === "error" ? "cancel" : "article"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

function RejectModal({ blog, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-600">cancel</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Reject Blog Post</h3>
        <p className="text-sm text-gray-500 mb-4">
          Rejecting <span className="font-bold text-gray-700">"{blog.title}"</span> by {blog.author}.
          The author will be notified with your reason.
        </p>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
          Rejection Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none h-28 mb-6"
          placeholder="e.g. This post contains unverified medical claims. Please provide peer-reviewed sources before resubmitting..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject Post
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onPublish }) {
  const [form, setForm] = useState({ title: "", category: "General", content: "" });
  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Create New Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Title</label>
            <input
              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Post title..."
              value={form.title}
              onChange={e => update("title", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Category</label>
            <select
              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none"
              value={form.category}
              onChange={e => update("category", e.target.value)}
            >
              {["General", "Cardiology", "Diabetes", "Neurology", "Technology", "Nutrition", "Mental Health"].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Content</label>
            <textarea
              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none h-40"
              placeholder="Write your post content here..."
              value={form.content}
              onChange={e => update("content", e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onPublish(form)}
              disabled={!form.title.trim() || !form.content.trim()}
              className="flex-1 px-4 py-3 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlogs() {
  const [activeTab, setActiveTab] = useState("all");
  const [blogs, setBlogs] = useState(mockBlogs);
  const [rejectModal, setRejectModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = blogs.filter((b) => activeTab === "all" || b.status === activeTab);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (blog) => {
    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, status: "published" } : b));
    showToast(`"${blog.title}" has been published.`, "success");
  };

  const handleReject = (reason) => {
    setBlogs(prev => prev.filter(b => b.id !== rejectModal.id));
    setRejectModal(null);
    showToast(`Post rejected and author notified.`, "error");
  };

  const handleDelete = (blog) => {
    setBlogs(prev => prev.filter(b => b.id !== blog.id));
    showToast(`"${blog.title}" has been deleted.`, "error");
  };

  const handlePublish = (form) => {
    const newPost = {
      id: String(Date.now()),
      title: form.title,
      author: "Admin",
      category: form.category,
      date: new Date().toISOString().split("T")[0],
      status: "published",
      likes: 0,
    };
    setBlogs(prev => [newPost, ...prev]);
    setShowCreateModal(false);
    showToast(`"${form.title}" published successfully.`, "success");
  };

  return (
    <AdminLayout title="Blog Management">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {rejectModal && (
        <RejectModal
          blog={rejectModal}
          onConfirm={handleReject}
          onCancel={() => setRejectModal(null)}
        />
      )}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPublish={handlePublish}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Blog Management</h2>
          <p className="text-gray-400 mt-1">Health content moderation and publishing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#7B2D8B] text-white rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Create New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-[#7B2D8B] mb-3 block">article</span>
          <p className="text-3xl font-black text-gray-800">{blogs.filter(b => b.status === "published").length}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Published Posts</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">pending</span>
          <p className="text-3xl font-black text-amber-600">{blogs.filter(b => b.status === "pending").length}</p>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-1">Pending Review</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-red-500 mb-3 block">flag</span>
          <p className="text-3xl font-black text-red-600">{blogs.filter(b => b.status === "flagged").length}</p>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mt-1">Flagged Content</p>
        </div>
      </div>

      {/* Flagged Alert */}
      {(activeTab === "all" || activeTab === "flagged") && blogs.some(b => b.status === "flagged") && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600">warning</span>
          <p className="text-sm font-semibold text-red-700">
            {blogs.filter(b => b.status === "flagged").length} posts require immediate review — potential misinformation detected.
          </p>
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
              {tab === "pending" && blogs.filter(b => b.status === "pending").length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {blogs.filter(b => b.status === "pending").length}
                </span>
              )}
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
            filtered.map((blog) => (
              <div key={blog.id} className="bg-[#fdf0f9] rounded-2xl p-5 flex flex-col gap-3">
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
                  <div className="flex gap-1">
                    <button className="p-1.5 text-[#7B2D8B] hover:bg-white rounded-lg transition-colors" title="View">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-white rounded-lg transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    {blog.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(blog)}
                          className="p-1.5 text-emerald-600 hover:bg-white rounded-lg transition-colors"
                          title="Approve & Publish"
                        >
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                        <button
                          onClick={() => setRejectModal(blog)}
                          className="p-1.5 text-red-500 hover:bg-white rounded-lg transition-colors"
                          title="Reject with reason"
                        >
                          <span className="material-symbols-outlined text-lg">cancel</span>
                        </button>
                      </>
                    )}
                    {blog.status !== "pending" && (
                      <button
                        onClick={() => handleDelete(blog)}
                        className="p-1.5 text-red-500 hover:bg-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
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
