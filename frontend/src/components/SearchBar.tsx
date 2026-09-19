import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => { const timer = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(timer); }, [value, delay]);
  return debouncedValue;
};

export const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  useEffect(() => onSearch(debouncedQuery), [debouncedQuery, onSearch]);

  return (
    <div className="group relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within:text-accent" size={17} />
      <input type="search" aria-label="Search stories, titles, or writers" placeholder="Search stories, titles, writers…" className="text-field !pl-10 !pr-10 [&::-webkit-search-cancel-button]:hidden" value={query} onChange={(event) => setQuery(event.target.value)} />
      {query && <button type="button" onClick={() => setQuery("")} className="icon-button fade absolute right-1.5 top-1/2 !h-8 !w-8 -translate-y-1/2" aria-label="Clear search"><X size={15} /></button>}
    </div>
  );
};
