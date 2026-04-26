import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockBlogs = [
  {
    _id: "1",
    title: "Managing Hypertension in Young Adults",
    category: "Cardiology",
    author: "Dr. Amanuel Tesfaye",
    date: "2025-04-20",
    likes: 142,
    readTime: "5 min",
    excerpt:
      "High blood pressure is no longer just an older adult problem. Learn how lifestyle changes and early intervention can make a significant difference.",
  },
  {
    _id: "2",
    title: "Understanding Type 2 Diabetes: A Patient Guide",
    category: "Diabetes",
    author: "Dr. Meron Alemu",
    date: "2025-04-15",
    likes: 98,
    readTime: "7 min",
    excerpt:
      "Type 2 diabetes affects millions worldwide. This guide breaks down what it means, how it's managed, and what you can do to live well with the condition.",
  },
  {
    _id: "3",
    title: "Heart Failure: Early Warning Signs",
    category: "Cardiology",
    author: "Dr. Amanuel Tesfaye",
    date: "2025-04-10",
    likes: 76,
    readTime: "4 min",
    excerpt:
      "Recognizing the early signs of heart failure can save lives. We explore the subtle symptoms that are often overlooked until it's too late.",
  },
  {
    _id: "4",
    title: "Lifestyle Changes for Better Cardiovascular Health",
    category: "General",
    author: "Dr. Dawit Bekele",
    date: "2025-04-05",
    likes: 203,
    readTime: "6 min",
    excerpt:
      "Small, consistent changes to your daily routine can dramatically reduce your risk of cardiovascular disease. Here's where to start.",
  },
  {
    _id: "5",
    title: "Children's Nutrition: Building Healthy Habits Early",
    category: "Pediatrics",
    author: "Dr. Meron Alemu",
    date: "2025-03-28",
    likes: 115,
    readTime: "5 min",
    excerpt:
      "The eating habits formed in childhood often persist into adulthood. Discover practical tips for raising healthy eaters from the start.",
  },
  {
    _id: "6",
    title: "Mental Health and Chronic Illness: Breaking the Stigma",
    category: "Mental Health",
    author: "Dr. Selamawit Haile",
    date: "2025-03-20",
    likes: 189,
    readTime: "8 min",
    excerpt:
      "Living with a chronic condition takes a toll on mental health. This article explores the connection and how to seek the right support.",
  },
];

const categories = [
  "All",
  "Cardiology",
  "Diabetes",
  "Pediatrics",
  "Mental Health",
  "General",
];

const categoryColors = {
  Cardiology: "bg-red-100 text-red-700",
  Diabetes: "bg-blue-100 text-blue-700",
  Pediatrics: "bg-emerald-100 text-emerald-700",
  "Mental Health": "bg-purple-100 text-purple-700",
  General: "bg-gray-100 text-gray-600",
};

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [liked, setLiked] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 400);
  }, []);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, likes: b.likes + (liked[id] ? -1 : 1) } : b,
      ),
    );
  };

  const filtered = blogs.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || b.category === category;
    return matchSearch && matchCat;
  });

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800">Health Blog</h1>
          <p className="text-gray-400 mt-1">
            Expert insights from our medical team
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632a7e]/20"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  category === c
                    ? "bg-[#632a7e] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#632a7e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Color banner */}
                <div className="h-2 bg-[#632a7e]" />
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[blog.category] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {blog.readTime} read
                    </span>
                  </div>
                  <Link to={`/blogs/${blog._id}`}>
                    <h3 className="font-bold text-gray-800 text-sm leading-snug hover:text-[#632a7e] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        {blog.author}
                      </p>
                      <p className="text-xs text-gray-400">{blog.date}</p>
                    </div>
                    <button
                      onClick={() => toggleLike(blog._id)}
                      className="flex items-center gap-1 text-xs font-semibold transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined text-base ${liked[blog._id] ? "text-red-500" : "text-gray-300"}`}
                      >
                        favorite
                      </span>
                      <span
                        className={
                          liked[blog._id] ? "text-red-500" : "text-gray-400"
                        }
                      >
                        {blog.likes}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-20 text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">
                  article
                </span>
                No articles found.
              </div>
            )}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
