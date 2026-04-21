const SkeletonMatches = () => {
  return (
    <div className="relative">
      <div className="space-y-3" style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 11, backgroundColor: "#1a1830", border: "1px solid #7F77DD" }} />
            <div className="flex-1 space-y-2">
              <div style={{ height: 14, width: "60%", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 4 }} />
              <div style={{ height: 10, width: "80%", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="px-5 py-3 rounded-xl text-center"
          style={{ backgroundColor: "rgba(8,8,8,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <p className="text-sm" style={{ color: "#fff", fontWeight: 500 }}>
            Complete your profile to reveal your matches
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkeletonMatches;
