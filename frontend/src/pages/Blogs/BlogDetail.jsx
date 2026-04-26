import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockBlogs = {
  1: {
    _id: "1",
    title: "Managing Hypertension in Young Adults",
    category: "Cardiology",
    author: "Dr. Amanuel Tesfaye",
    authorSpecialty: "Cardiologist",
    date: "April 20, 2025",
    likes: 142,
    readTime: "5 min",
    content: `High blood pressure — or hypertension — is increasingly common among people in their 20s and 30s. Once considered a condition of older adults, it now affects a growing number of young people due to sedentary lifestyles, poor diet, and chronic stress.\n\nWhat is Hypertension?\nBlood pressure is measured in two numbers: systolic (the pressure when your heart beats) and diastolic (the pressure between beats). A reading consistently above 130/80 mmHg is considered hypertension.\n\nWhy Young Adults Are at Risk\nSeveral factors contribute to rising hypertension rates in younger populations:\n• High sodium diets and processed food consumption\n• Physical inactivity and sedentary work\n• Chronic stress and poor sleep\n• Excessive alcohol and caffeine intake\n• Genetic predisposition\n\nManagement Strategies\nThe good news is that hypertension in young adults is highly manageable — often without medication — through lifestyle changes:\n\n1. Regular Exercise: Aim for at least 150 minutes of moderate aerobic activity per week. Even brisk walking makes a significant difference.\n\n2. Dietary Changes: Reduce sodium intake, increase potassium-rich foods (bananas, leafy greens), and follow a DASH diet approach.\n\n3. Stress Management: Mindfulness, meditation, and adequate sleep (7–9 hours) can meaningfully lower blood pressure.\n\n4. Limit Alcohol: No more than one drink per day for women, two for men.\n\n5. Regular Monitoring: Home blood pressure monitors are affordable and allow you to track trends over time.\n\nWhen to See a Doctor\nIf lifestyle changes don't bring your blood pressure under control within 3–6 months, or if your readings are consistently above 140/90 mmHg, consult a healthcare provider. Medication may be necessary and is nothing to be ashamed of.\n\nConclusion\nHypertension is a silent condition — most people feel no symptoms until serious damage has occurred. Early detection and proactive management are your best tools for a long, healthy life.`,
  },
  2: {
    _id: "2",
    title: "Understanding Type 2 Diabetes: A Patient Guide",
    category: "Diabetes",
    author: "Dr. Meron Alemu",
    authorSpecialty: "Pediatrician & Internist",
    date: "April 15, 2025",
    likes: 98,
    readTime: "7 min",
    content: `Type 2 diabetes is a chronic condition that affects how your body processes blood sugar (glucose). Unlike Type 1, it develops gradually and is often preventable or manageable with the right approach.\n\nHow It Develops\nIn Type 2 diabetes, your cells become resistant to insulin — the hormone that allows glucose to enter cells for energy. Your pancreas compensates by producing more insulin, but over time it can't keep up, leading to elevated blood sugar levels.\n\nCommon Symptoms\n• Increased thirst and frequent urination\n• Fatigue and blurred vision\n• Slow-healing wounds\n• Tingling or numbness in hands and feet\n• Unexplained weight loss\n\nDiagnosis\nType 2 diabetes is diagnosed through blood tests: fasting glucose, HbA1c (a 3-month average), or an oral glucose tolerance test.\n\nManagement\nManaging Type 2 diabetes involves a combination of lifestyle changes and, when necessary, medication:\n\n• Diet: Focus on whole grains, vegetables, lean proteins, and healthy fats. Limit refined carbohydrates and sugary drinks.\n• Exercise: Regular physical activity improves insulin sensitivity significantly.\n• Medication: Metformin is typically the first-line medication. Others may be added as needed.\n• Monitoring: Regular blood glucose checks help you understand how food, activity, and medication affect your levels.\n\nLiving Well with Diabetes\nMillions of people live full, active lives with Type 2 diabetes. The key is consistency — small daily habits compound into significant health outcomes over time.`,
  },
};

const categoryColors = {
  Cardiology: "bg-red-100 text-red-700",
  Diabetes: "bg-blue-100 text-blue-700",
  Pediatrics: "bg-emerald-100 text-emerald-700",
  "Mental Health": "bg-purple-100 text-purple-700",
  General: "bg-gray-100 text-gray-600",
};

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const b = mockBlogs[id] ?? Object.values(mockBlogs)[0];
      setBlog(b);
      setLikes(b.likes);
      setLoading(false);
    }, 300);
  }, [id]);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };

  if (loading)
    return (
      <PatientLayout>
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 border-4 border-[#632a7e] border-t-transparent rounded-full animate-spin" />
        </div>
      </PatientLayout>
    );

  const paragraphs = blog.content.split("\n\n");

  return (
    <PatientLayout>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#632a7e] mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[blog.category] ?? "bg-gray-100 text-gray-600"}`}
            >
              {blog.category}
            </span>
            <span className="text-xs text-gray-400">{blog.readTime} read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight mb-5">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#632a7e] font-bold text-sm">
                {blog.author
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{blog.author}</p>
                <p className="text-xs text-gray-400">
                  {blog.authorSpecialty} · {blog.date}
                </p>
              </div>
            </div>
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <span
                className={`material-symbols-outlined text-lg ${liked ? "text-red-500" : "text-gray-400"}`}
              >
                favorite
              </span>
              <span
                className={`text-sm font-semibold ${liked ? "text-red-500" : "text-gray-400"}`}
              >
                {likes}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
          {paragraphs.map((para, i) => {
            if (para.startsWith("•")) {
              const items = para.split("\n").filter((l) => l.startsWith("•"));
              return (
                <ul key={i} className="space-y-2">
                  {items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#632a7e] mt-2 shrink-0" />
                      {item.replace("• ", "")}
                    </li>
                  ))}
                </ul>
              );
            }
            const isHeading = para.length < 60 && !para.includes(".") && i > 0;
            if (isHeading) {
              return (
                <h2 key={i} className="text-lg font-bold text-gray-800 pt-2">
                  {para}
                </h2>
              );
            }
            return (
              <p key={i} className="text-sm text-gray-700 leading-relaxed">
                {para}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-purple-50 rounded-2xl p-6 text-center">
          <p className="font-bold text-gray-800 mb-2">
            Have questions about your health?
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Book a consultation with one of our verified specialists.
          </p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              stethoscope
            </span>
            Find a Doctor
          </Link>
        </div>
      </div>
    </PatientLayout>
  );
}
