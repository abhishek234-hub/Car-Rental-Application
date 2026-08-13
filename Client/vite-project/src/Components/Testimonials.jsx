const Testimonials = () => {
  const reviews = [
    {
      name: "Abhishek",
      role: "Traveler",
      text: "“Amazing experience and clean, reliable cars. Booking process was super smooth and support was always there.”"
    },
    {
      name: "Rahul",
      role: "Daily Commuter",
      text: "“Best car rental platform with highly affordable pricing and absolutely great customer support. Highly recommended.”"
    },
    {
      name: "Aryan",
      role: "Weekend Explorer",
      text: "“Loved the interactive UI and booking system. The Maruti Swift I rented was in pristine condition, spotless inside and out.”"
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-20 bg-white/10 dark:bg-slate-950/10 border-t border-b border-white/40 dark:border-slate-900/40 backdrop-blur-sm relative overflow-hidden">
      
      {/* Accent Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-300/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-20 relative z-10">
        <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          What Clients Say
        </h1>

        <p className="text-slate-655 dark:text-slate-400 mt-4 text-lg font-bold">
          Trusted by thousands of happy customers
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 relative z-10 [perspective:1000px]">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-[0_12px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.12)] [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(15px)] hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <p className="text-slate-655 dark:text-slate-300 leading-8 font-semibold [transform:translateZ(20px)] italic">
              {rev.text}
            </p>

            <div className="mt-8 [transform:translateZ(25px)] pt-4 border-t border-white/50 dark:border-slate-800/50">
              <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {rev.name}
              </h1>

              <p className="text-orange-600 dark:text-orange-400 font-bold text-xs mt-1 uppercase tracking-wider">
                {rev.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;