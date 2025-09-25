import React from "react";

export default function About() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[520px]">
        {/* Background Image */}
        <img
          src="/aboutuspic/A-1.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Color Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-indigo-700/30 to-amber-700/20"></div>

        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
            DMS-X — Disaster Management System
          </h1>
          <p className="mt-4 max-w-3xl text-lg md:text-xl text-gray-100/90">
            Empowering Indian communities with practical disaster preparedness education,
            school-ready emergency tools, and real-time response support since 2020.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="mailto:contact@dmsx.in?subject=Request%20Demo"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-full font-semibold shadow-lg transition"
            >
              📩 Request a Demo
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full border border-white/20 transition"
            >
              📞 Contact Us
            </a>
          </div>

          <div className="mt-8 text-sm text-white/80">
            Trusted by Indian schools & community groups • Official resources:{" "}
            <a className="underline" href="https://ndma.gov.in" target="_blank" rel="noreferrer">
              NDMA
            </a>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Our Mission</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            At DMS-X we believe preparedness saves lives. Our mission is to make accessible,
            culturally relevant and hands-on disaster education available to every school and
            community across India. We combine local knowledge, Indian case studies and modern
            learning techniques so learners gain practical skills they can use in real situations.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            From gamified learning modules to an Emergency Hub used by school administrators and
            first responders, DMS-X focuses on building resilient communities — one classroom at a time.
          </p>

          {/* Icons List */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">🛡️</div>
              <div>
                <div className="font-semibold">Safety First</div>
                <div className="text-xs text-gray-500">Hands-on drills & checklists</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-50 p-2 text-amber-600">📘</div>
              <div>
                <div className="font-semibold">Interactive Learning</div>
                <div className="text-xs text-gray-500">Videos, quizzes & simulations</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">🤝</div>
              <div>
                <div className="font-semibold">Community Focus</div>
                <div className="text-xs text-gray-500">School & parent engagement</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-50 p-2 text-pink-600">⏰</div>
              <div>
                <div className="font-semibold">24/7 Support</div>
                <div className="text-xs text-gray-500">Emergency tools & helplines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Image */}
        <div className="flex-1">
          <div className="w-full h-[360px] rounded-lg overflow-hidden shadow-lg border">
            <img src="/aboutuspic/A-2.jpg" alt="Mission" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 px-6 md:px-20 bg-gradient-to-tr from-white to-indigo-50">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team (India)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              name: "Dr. Priya Menon",
              role: "Disaster Management Specialist",
              desc: "20+ years in disaster response — former NDRF collaborator and trainer.",
              img: "/aboutuspic/A-4.jpg",
            },
            {
              name: "Dr. Rajesh Kumar",
              role: "Education Lead",
              desc: "Designs our gamified curriculum and works with schools across Maharashtra & Kerala.",
              img: "/aboutuspic/A-5.jpg",
            },
            {
              name: "Arjun Patel",
              role: "Head of Technology",
              desc: "Leads product & engineering — builds the Emergency Hub and school dashboards.",
              img: "/aboutuspic/A-7.jpg",
            },
            {
              name: "Sunita Reddy ",
              role: "Response Coordinator",
              desc: "Ex-first responder coordinating drills and community training in Telangana.",
              img: "/aboutuspic/A-6.jpg",
            },
          ].map((member, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg shadow-lg text-center hover:scale-105 transform transition">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-100">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-amber-600 text-sm mt-1">{member.role}</p>
              <p className="text-gray-600 text-sm mt-3">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey (Timeline) */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-indigo-200 h-full"></div>

          {[
            {
              
              title: "DMS-X Founded (New Delhi)",
              desc: "Started with a pilot in Delhi schools to teach earthquake safety and basic first aid.",
            },
            {

              title: "State Partnerships",
              desc: "Expanded to Maharashtra & Kerala with 20+ partner schools and community workshops.",
            },
            {
              
              title: "Emergency Hub Launch",
              desc: "Real-time emergency mapping, local relief centre pointers and helpline integration.",
            },
            {
              
              title: "Scale & Impact",
              desc: "Trained 8,000+ students and integrated local-language modules for regional accessibility.",
            },
            {
              
              title: "Nationwide School Program",
              desc: "Pilots completed in 5 states; next step: 50+ partner schools across India.",
            },
          ].map((item, idx) => (
            <div key={idx} className="mb-12 flex items-start md:items-center">
              <div className={`flex-none w-1/2 pr-8 ${idx % 2 === 0 ? "text-right md:text-right md:pr-12" : ""}`}>
                <div className="inline-block px-3 py-2 rounded-md bg-indigo-600 text-white font-semibold">
                  {item.year}
                </div>
              </div>

              <div className="flex-1 bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-indigo-700">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact by Numbers */}
      <section className="py-16 bg-indigo-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Impact by Numbers (India)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-white/10 rounded-xl shadow">
            <h3 className="text-4xl font-extrabold">10,000+</h3>
            <p className="mt-2">Students Trained</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow">
            <h3 className="text-4xl font-extrabold">120+</h3>
            <p className="mt-2">Community Workshops</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow">
            <h3 className="text-4xl font-extrabold">95%</h3>
            <p className="mt-2">Average Module Completion</p>
          </div>
        </div>
        <p className="mt-6 text-sm">Certified training materials aligned with Indian disaster response standards.</p>
      </section>

      {/* Get in Touch */}
      <section id="contact" className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Interested in bringing DMS-X to your school or community? Fill a short form or contact our India support team.
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-semibold">Email Us</h3>
            <p className="text-sm text-gray-600 mt-2">contact@dmsx.in</p>
            <a className="mt-4 inline-block text-amber-500" href="mailto:contact@dmsx.in">Send Email →</a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-semibold">Call Us</h3>
            <p className="text-sm text-gray-600 mt-2">+91-11-4000-8000</p>
            <a className="mt-4 inline-block text-amber-500" href="tel:+911140008000">Call Now →</a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-semibold">Visit Us</h3>
            <p className="text-sm text-gray-600 mt-2">DMS-X HQ, 23 Safety Marg, New Delhi, India</p>
            <a className="mt-4 inline-block text-amber-500" href="https://www.google.com/maps" target="_blank" rel="noreferrer">Open in Maps →</a>
          </div>
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="p-3 border rounded-lg" placeholder="Your name" />
            <input className="p-3 border rounded-lg" placeholder="Email" />
            <input className="p-3 border rounded-lg" placeholder="Phone" />
            <textarea className="p-3 border rounded-lg md:col-span-3" rows={4} placeholder="How can we help?" />
            <button className="md:col-span-3 bg-amber-500 text-white px-5 py-3 rounded-lg font-semibold hover:bg-amber-600 transition">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-bold text-white">DMS-X</h3>
            <p className="text-sm text-gray-400 mt-1">Disaster Management & Preparedness — India</p>
          </div>

          <div className="flex gap-4 text-sm">
            <a href="https://ndma.gov.in" target="_blank" rel="noreferrer" className="hover:underline">NDMA</a>
            <a href="https://ndrf.gov.in" target="_blank" rel="noreferrer" className="hover:underline">NDRF</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
