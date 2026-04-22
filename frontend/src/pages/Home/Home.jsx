const Home = () => {
  return (
    <div className="min-h-screen bg-[#fdf7f9] font-sans text-gray-800">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-[#632a7e] font-bold text-xl cursor-pointer">
          Concierge Health
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="text-[#632a7e] font-medium hover:opacity-80">
            Login
          </a>

          <button className="bg-[#632a7e] text-white px-6 py-2 rounded-full font-medium hover:bg-purple-900 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#ece1ef] px-4 py-1.5 rounded-full text-[#7a5a8a] text-sm font-medium">
            <span className="text-xs">🛡️</span>
            Precision Health Monitoring
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-[#632a7e] leading-tight">
            Your Clinical <br />
            <span className="text-[#8b3d30]">Sanctuary,</span> <br />
            Anywhere.
          </h1>

          <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md">
            Monitor vital signs with hospital-grade precision using nothing but
            your smartphone camera. No hardware, no wires—just advanced rPPG
            technology at your fingertips.
          </p>

          <div className="flex gap-4 pt-4">
            <button className="bg-[#632a7e] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-purple-900 shadow-lg transition-all">
              Join Now
            </button>

            <button className="bg-[#eee4ea] text-gray-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative">
          <div className="rounded-[40px] overflow-hidden shadow-2xl">
            <img
              src="https://i.pinimg.com/1200x/94/6e/cf/946ecf2091b6057cb2179e0d9c000f2d.jpg"
              alt="Doctor using tablet"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-[-20px] left-[-20px] bg-white p-6 rounded-3xl shadow-xl border border-gray-100 min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 font-bold text-xs tracking-widest">
                HEART RATE
              </span>
              <span className="text-red-500">❤️</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-800">72</span>
              <span className="text-gray-400 font-bold text-sm">BPM</span>
            </div>

            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#632a7e] w-[72%]"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Advanced Care Pillars Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Advanced Care Pillars
          </h2>
          <p className="text-gray-500 mt-3">
            Combining medical expertise with cutting-edge optical vital detection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="text-purple-700 text-xl mb-4">🎥</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              AI-Powered Vital Tracking (rPPG)
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Our clinical-grade camera technology analyzes blood volume changes
              through your skin to deliver instant vitals.
            </p>
            <div className="absolute right-6 bottom-6 text-gray-200 text-6xl">
              📡
            </div>
          </div>

          <div className="bg-gray-100 rounded-3xl p-8 shadow-sm">
            <div className="text-purple-700 text-xl mb-4">🛡️</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Secure Medical Records
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              HIPAA-compliant, end-to-end encrypted vault for your health history.
            </p>
          </div>
          
        </div>
        <div className="mt-16 bg-[#8b1d18] rounded-3xl px-10 py-12 flex flex-col md:flex-row items-center justify-between text-white shadow-lg"> <div> <h3 className="text-2xl md:text-3xl font-bold mb-2"> Ready to transform your health? </h3> <p className="text-red-100"> Join over 50,000 users in the clinical revolution. </p> </div> <button className="mt-6 md:mt-0 bg-white text-[#8b1d18] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"> Get Started Now </button> </div>
      </section>

      {/* ===================== PATIENT JOURNEY SECTION (ADDED FROM IMAGE) ===================== */}
      <section className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#632a7e] mb-8">
            The Patient Journey
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-[#632a7e] font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg">Seamless Enrollment</h3>
                <p className="text-gray-500 text-sm">
                  Create your profile and secure your medical ID in less than 3 minutes.
                  No hardware shipments required.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-[#632a7e] font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg">Capture Vitals Instantly</h3>
                <p className="text-gray-500 text-sm">
                  Look into your front-facing camera. Our rPPG algorithm tracks your heart rate,
                  SPO2, and stress levels in real-time.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-[#632a7e] font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg">Concierge Review</h3>
                <p className="text-gray-500 text-sm">
                  Your data is instantly shared with your dedicated medical team
                  for proactive intervention and wellness planning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex justify-center">
          <img
            src="https://i.pinimg.com/1200x/e0/e4/31/e0e43116340409b58609b9a1e69df512.jpg"
            alt="Patient journey app preview"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* CTA SECTION (PURPLE CARD FROM IMAGE) */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="bg-[#632a7e] text-white rounded-3xl px-10 py-14 text-center shadow-xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Sanctuary.
          </h3>
          <p className="text-purple-100 mb-8">
            Join Concierge Health today and get your first consultation free.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-[#632a7e] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Create Account
            </button>
            <button className="bg-purple-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-900 transition">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;