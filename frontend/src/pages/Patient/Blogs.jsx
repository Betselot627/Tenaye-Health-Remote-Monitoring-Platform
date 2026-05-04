import { useState, useEffect } from "react";
import PatientLayout from "./components/PatientLayout";
import { getAllBlogs, toggleLikeBlog } from "../../services/adminService";

const categories = ["All", "Technology", "Nutrition", "Cardiology", "Mindfulness", "General"];

const categoryStyles = {
  "Technology": "border-[#6B21A8] text-[#6B21A8]",
  "Nutrition": "bg-orange-100 text-orange-700 border-orange-200",
  "Cardiology": "border-[#6B21A8] text-[#6B21A8]",
  "Mindfulness": "bg-teal-100 text-teal-700 border-teal-200",
  "General": "border-gray-300 text-gray-600",
};

const getCategoryStyle = (category) => categoryStyles[category] || categoryStyles["General"];

function BlogModal({ blog, onClose, onLike, likedBlogs }) {
  const [localLikes, setLocalLikes] = useState(blog.likes || 0);
  const isLiked = likedBlogs?.has(blog.id);
  
  const handleLike = async () => {
    const result = await onLike(blog.id);
    if (result.data) {
      // Toggle local like count
      setLocalLikes(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-[#E05C8A] to-[#F4845F] p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-lg">
              close
            </span>
          </button>
          <span
            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 bg-white/20 text-white`}
          >
            {blog.category}
          </span>
          <h3 className="font-black text-xl leading-snug">{blog.title}</h3>
          <div className="flex items-center gap-3 mt-3 text-white/80 text-xs">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">person</span>
              {blog.author}
            </span>
            <span>·</span>
            <span>{blog.specialty}</span>
            <span>·</span>
            <span>{blog.readTime}</span>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Full blog content */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.content || blog.excerpt}
          </div>
          <div className="flex gap-2 flex-wrap">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-[#E05C8A] rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${isLiked ? 'text-[#E05C8A]' : ''}`}>
                favorite
              </span>
              {localLikes} likes
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                visibility
              </span>
              {blog.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              {blog.date}
            </span>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button 
            onClick={handleLike}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            {localLikes}
          </button>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/patient/blogs`;
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  text: blog.excerpt,
                  url: shareUrl,
                });
              } else {
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
              }
            }}
            className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [likedBlogs, setLikedBlogs] = useState(new Set()); // Track which blogs user has liked

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await getAllBlogs();
        if (result.data) {
          // Transform backend data to match component structure
          const transformed = result.data.map((blog) => ({
            id: blog._id,
            title: blog.title,
            excerpt: blog.content?.substring(0, 150) + "..." || "No content",
            content: blog.content,
            category: blog.category || "General",
            author: blog.author?.full_name === "My Admin" ? "Medical Team" : (blog.author?.full_name || "Medical Team"),
            authorAvatar: blog.author?.avatar_url,
            coverImage: blog.cover_image_url,
            likes: blog.likes?.length || 0,
            views: Math.floor(Math.random() * 1000) + 100, // TODO: Add views field
            date: blog.published_at
              ? new Date(blog.published_at).toLocaleDateString()
              : new Date(blog.createdAt).toLocaleDateString(),
            readTime: `${Math.ceil((blog.content?.length || 0) / 1000)} min read`,
            tags: blog.tags || ["health", "medical"],
            specialty: "Medical Professional",
          }));
          setBlogs(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleLikeBlog = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to like articles");
      return { data: null, error: "Not authenticated" };
    }
    
    const isLiked = likedBlogs.has(blogId);
    const result = await toggleLikeBlog(blogId);
    
    if (result.data) {
      // Toggle local liked state
      setLikedBlogs(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(blogId);
        } else {
          newSet.add(blogId);
        }
        return newSet;
      });
      
      // Update like count locally (toggle +1 or -1)
      setBlogs(blogs.map(b => {
        if (b.id === blogId) {
          const currentLikes = b.likes || 0;
          return { ...b, likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 };
        }
        return b;
      }));
    } else if (result.error) {
      alert(result.error || "Failed to like article. Please try again.");
    }
    return result;
  };

  const filtered = blogs.filter((b) => {
    const matchCategory = category === "All" || b.category === category;
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <PatientLayout title="Health Blog">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#E05C8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Health Blogs">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-[#E05C8A] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">article</span>
            Health Blogs
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Expert health articles from our doctors
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E05C8A] focus:ring-2 focus:ring-rose-100 bg-white"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E05C8A] bg-white text-gray-700 font-semibold"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Blog Grid - 3 Cards Per Row */}
        {filtered.length > 0 && category === "All" && !search && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.slice(0, 6).map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group flex flex-col"
                onClick={() => setSelected(blog)}
              >
                <div className="h-90 overflow-hidden">
                  {blog.coverImage ? (
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#6B21A8]/10 to-[#A855F7]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-[#6B21A8]/30">article</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col grow">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-1 ${getCategoryStyle(blog.category)}`}>
                    {blog.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#1A1A2E] leading-tight mb-1 group-hover:text-[#6B21A8] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6B21A8] to-[#A855F7] flex items-center justify-center text-white text-[8px] font-bold">
                        {blog.author[0]}
                      </div>
                      <span className="text-[9px] font-bold text-[#1A1A2E]">{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeBlog(blog.id);
                        }}
                        className="flex items-center gap-0.5 text-[9px] text-gray-400 hover:text-[#6B21A8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">favorite</span>
                        {blog.likes}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const shareUrl = `${window.location.origin}/patient/blogs`;
                          if (navigator.share) {
                            navigator.share({
                              title: blog.title,
                              text: blog.excerpt,
                              url: shareUrl,
                            });
                          } else {
                            navigator.clipboard.writeText(shareUrl);
                            alert('Link copied to clipboard!');
                          }
                        }}
                        className="flex items-center text-[9px] text-gray-400 hover:text-[#6B21A8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filtered/Searched Results - Simple Grid */}
        {(category !== "All" || search) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((blog) => (
              <div
                key={blog.id}
                onClick={() => setSelected(blog)}
                className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group flex flex-col"
              >
                <div className="h-90 overflow-hidden">
                  {blog.coverImage ? (
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#6B21A8]/10 to-[#A855F7]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-[#6B21A8]/30">article</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col grow">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-1 ${getCategoryStyle(blog.category)}`}>
                    {blog.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#1A1A2E] leading-tight mb-1 group-hover:text-[#6B21A8] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6B21A8] to-[#A855F7] flex items-center justify-center text-white text-[8px] font-bold">
                        {blog.author[0]}
                      </div>
                      <span className="text-[9px] font-bold text-[#1A1A2E]">{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeBlog(blog.id);
                        }}
                        className="flex items-center gap-0.5 text-[9px] text-gray-400 hover:text-[#6B21A8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">favorite</span>
                        {blog.likes}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const shareUrl = `${window.location.origin}/patient/blogs`;
                          if (navigator.share) {
                            navigator.share({
                              title: blog.title,
                              text: blog.excerpt,
                              url: shareUrl,
                            });
                          } else {
                            navigator.clipboard.writeText(shareUrl);
                            alert('Link copied to clipboard!');
                          }
                        }}
                        className="flex items-center text-[9px] text-gray-400 hover:text-[#6B21A8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-200">
              article
            </span>
            <p className="text-gray-400 mt-3">No articles found</p>
          </div>
        )}
      </div>

      {selected && (
        <BlogModal blog={selected} onClose={() => setSelected(null)} onLike={handleLikeBlog} likedBlogs={likedBlogs} />
      )}
    </PatientLayout>
  );
}
