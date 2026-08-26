export default function FabricSpecs() {
  const specs = [
    "240 GSM",
    "Bio-Washed", 
    "Pre-Shrunk",
    "Drop Shoulder",
    "Boxy Cut",
    "French Terry",
    "320 GSM Hoodie"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors duration-200"
          >
            {spec}
          </div>
        ))}
      </div>
    </div>
  );
}
