const AuthImagePattern = ({ title, subtitle }) => {
  return (
    // Container: Only visible on large screens (hidden on smaller devices)
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      
      {/* Inner container with max width and centered text */}
      <div className="max-w-md text-center">

        {/* 3x3 Grid Pattern with 9 animated squares */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : "" 
              }`}
            />
          ))}
        </div>

        {/* Title (bold, large text) */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Subtitle (light text) */}
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;