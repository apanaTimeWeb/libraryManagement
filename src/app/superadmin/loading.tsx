export default function SuperadminLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[60vh] gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
        {/* Inner glowing ring */}
        <div className="absolute w-10 h-10 border-b-2 border-emerald-400 rounded-full animate-spin shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        {/* Core dot */}
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
      <p className="text-sm font-semibold text-white/50 tracking-widest uppercase animate-pulse mt-4">
        Loading Module...
      </p>
    </div>
  );
}
