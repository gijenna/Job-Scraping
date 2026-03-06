interface EventFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: "all", label: "All Events" },
  { key: "in-person", label: "In-Person" },
  { key: "digital", label: "Digital" },
  { key: "workshop", label: "Workshop" },
  { key: "free", label: "Free" },
];

const EventFilters = ({ activeFilter, onFilterChange }: EventFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === f.key
              ? "bg-events-coral text-events-teal"
              : "bg-events-card text-events-cream/70 hover:bg-events-card/80 hover:text-events-cream border border-events-cream/10"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default EventFilters;
