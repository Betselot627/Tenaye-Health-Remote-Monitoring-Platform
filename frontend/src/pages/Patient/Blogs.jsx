import { useState } from "react";
import PatientLayout from "./components/PatientLayout";
import { mockBlogs } from "./data/mockData";

const categories = [
  "All",
  "Heart Health",
  "Diabetes",
  "Skin Health",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
];

const categoryColors = {
  "Heart Health": "bg-red-100 text-red-700",
  Diabetes: "bg-amber-100 text-amber-700",
  "Skin Health": "bg-pink-100 text-pink-700",
  Neurology: "bg-purple-100 text-purple-700",
  Pediatrics: "bg-blue-100 text-blue-700",
  Orthopedics: "bg-emerald-100 text-emerald-700",
};

function BlogModal({ blog, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] p-6 text-white relative flex-shrink-0">
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
          <p className="text-gray-600 leading-relaxed">{blog.excerpt}</p>
          <div className="p-4 bg-[#fdf0f9]/50 rounded-xl border border-purple-100 text-sm text-gray-600 leading-relaxed">
            <p>
              This is a preview of the full article. In the complete version,
              you'll find detailed information about {blog.title.toLowerCase()},
              including expert advice from {blog.author} and evidence-based
              recommendations for patients.
            </p>
            <p className="mt-3">
              Topics covered include diagnosis, treatment options, lifestyle
              modifications, and when to seek medical attention.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-[#7B2D8B] rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                favorite
              </span>
              {blog.likes} likes
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
          <button className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">favorite</span>
            Like Article
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientBlogs() {
  const [blogs] = useState(mockBlogs);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = blogs.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || b.category === category;
    return matchSearch && matchCat;
  });

  return (
    <PatientLayout title="Health Blogs">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-[#7B2D8B] flex items-center gap-2">
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B2D8B] focus:ring-2 focus:ring-purple-100 bg-white"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B2D8B] bg-white text-gray-700 font-semibold"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Featured blog */}
        {filtered.length > 0 && category === "All" && !search && (
          <div
            onClick={() => setSelected(filtered[0])}
            className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-16 -mt-16 bg-white/10" />
            <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 mb-3">
              {filtered[0].category} · Featured
            </span>
            <h3 className="text-xl font-black leading-snug max-w-lg">
              {filtered[0].title}
            </h3>
            <p className="text-white/80 text-sm mt-2 max-w-lg line-clamp-2">
              {filtered[0].excerpt}
            </p>
            <div className="flex items-center gap-4 mt-4 text-white/70 text-xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  person
                </span>
                {filtered[0].author}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  schedule
                </span>
                {filtered[0].readTime}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  favorite
                </span>
                {filtered[0].likes}
              </span>
            </div>
          </div>
        )}

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(category === "All" && !search ? filtered.slice(1) : filtered).map(
            (blog) => (
              <div
                key={blog.id}
                onClick={() => setSelected(blog)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-5 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[blog.category] || "bg-gray-100 text-gray-600"}`}
                  >
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-400">{blog.readTime}</span>
                </div>
                <h3 className="text-sm font-black text-gray-800 leading-snug group-hover:text-[#7B2D8B] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#7B2D8B] text-sm">
                        person
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        {blog.author}
                      </p>
                      <p className="text-[10px] text-gray-400">{blog.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">
                        favorite
                      </span>
                      {blog.likes}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">
                        visibility
                      </span>
                      {blog.views}
                    </span>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

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
        <BlogModal blog={selected} onClose={() => setSelected(null)} />
      )}
    </PatientLayout>
  );
}
