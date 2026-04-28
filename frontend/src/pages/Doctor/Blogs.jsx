import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";

const mockDoctorBlogs = [
  {
    id: "1",
    title: "Managing Hypertension in Young Adults",
    category: "Cardiology",
    date: "2025-04-20",
    status: "published",
    likes: 142,
  },
  {
    id: "2",
    title: "Understanding Type 2 Diabetes: A Patient Guide",
    category: "Diabetes",
    date: "2025-04-15",
    status: "published",
    likes: 98,
  },
  {
    id: "3",
    title: "Heart Failure: Early Warning Signs",
    category: "Cardiology",
    date: "2025-04-10",
    status: "pending",
    likes: 0,
  },
  {
    id: "4",
    title: "Lifestyle Changes for Better Cardiovascular Health",
    category: "General",
    date: "2025-04-05",
    status: "draft",
    likes: 0,
  },
];

const statusColors = {
  published: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  draft: "bg-gray-100 text-gray-500",
  flagged: "bg-red-100 text-red-700",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-600" : "bg-[#0D7377]"}`}
    >
      <span className="material-symbols-outlined text-lg">
        {type === "success"
          ? "check_circle"
          : type === "error"
            ? "cancel"
            : "article"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

function CreatePostModal({ onClose, onPublish }) {
  const [form, setForm] = useState({
    title: "",
    category: "General",
    content: "",
    status: "published",
  });
  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Write New Post</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
              Title
            </label>
            <input
              className="w-full bg-[#f0fafa] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Post title..."
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
              Category
            </label>
            <select
              className="w-full bg-[#f0fafa] border-none rounded-xl px-4 py-3 text-sm focus:outline-none"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {[
                "General",
                "Cardiology",
                "Diabetes",
                "Neurology",
                "Technology",
                "Nutrition",
                "Mental Health",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
              Content
            </label>
            <textarea
              className="w-full bg-[#f0fafa] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none h-40"
              placeholder="Write your post content here..."
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
              Publish As
            </label>
            <div className="flex gap-3">
              {["published", "draft"].map((s) => (
                <button
                  key={s}
                  onClick={() => update("status", s)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors ${
                    form.status === s
                      ? "bg-[#0D7377] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s === "published" ? "Publish Now" : "Save as Draft"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onPublish(form)}
              disabled={!form.title.trim() || !form.content.trim()}
              className="flex-1 px-4 py-3 bg-[#0D7377] text-white rounded-xl font-bold text-sm hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {form.status === "published" ? "Publish" : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setBlogs(mockDoctorBlogs);
      setLoading(false);
    }, 400);
  }, []);

  if (loading)
    return (
      <DoctorLayout title="My Blogs">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DoctorLayout>
    );

  const filtered = blogs.filter(
    (b) => activeTab === "all" || b.status === activeTab,
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePublish = (form) => {
    const newPost = {
      id: String(Date.now()),
      title: form.title,
      category: form.category,
      date: new Date().toISOString().split("T")[0],
      status: form.status,
      likes: 0,
    };
    setBlogs((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
    showToast(
      `"${form.title}" ${form.status === "published" ? "published" : "saved as draft"}.`,
      "success",
    );
  };

  const handleDelete = (blog) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    showToast(`"${blog.title}" deleted.`, "error");
  };

  return (
    <DoctorLayout title="My Blogs">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
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
          <h2 className="text-3xl font-black text-[#0D7377]">My Blogs</h2>
          <p className="text-gray-400 mt-1">
            Share your medical knowledge with patients
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D7377] to-[#14A085] text-white rounded-full font-bold shadow-lg shadow-teal-200 hover:shadow-purple-400 hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Write New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Published",
            value: blogs.filter((b) => b.status === "published").length,
            color: "text-emerald-600",
            bg: "bg-white",
          },
          {
            label: "Pending Review",
            value: blogs.filter((b) => b.status === "pending").length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Total Likes",
            value: blogs.reduce((sum, b) => sum + b.likes, 0),
            color: "text-[#0D7377]",
            bg: "bg-white",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} p-6 rounded-2xl shadow-sm`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "published", "pending", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab
                  ? "bg-[#0D7377] text-white"
                  : "text-gray-400 hover:bg-[#f0fafa]"
              }`}
            >
              {tab === "all"
                ? "All Posts"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">
                article
              </span>
              <p className="text-gray-400 font-medium">
                No posts in this category.
              </p>
            </div>
          ) : (
            filtered.map((blog) => (
              <div
                key={blog.id}
                className="bg-[#f0fafa] rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="w-full h-32 bg-gradient-to-br from-[#0D7377]/20 to-[#600f72]/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#0D7377]/30">
                    article
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-white text-[#0D7377] text-xs font-bold rounded-full">
                    {blog.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[blog.status]}`}
                  >
                    {blog.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm leading-snug">
                  {blog.title}
                </h4>
                <p className="text-xs text-gray-400">{blog.date}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="material-symbols-outlined text-sm">
                      favorite
                    </span>
                    {blog.likes.toLocaleString()}
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="p-1.5 text-gray-400 hover:bg-white rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      className="p-1.5 text-red-500 hover:bg-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
