// src/components/SearchBar.tsx
import React from 'react';

type Props = {
  query: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchBar({ query, onChange, onSubmit }: Props) {
  return (
<form onSubmit={onSubmit} className=" flex items-center">
  <input
    type="text"
    placeholder="Buscar por nombre"
    value={query}
    onChange={(e) => onChange(e.target.value)}
    className="px-2 py-2 w-[300px] mr-2 p-2  rounded-2xl border border-zinc-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="px-4 py-2 bg-slate-700/30 border border-zinc-300/30 text-white rounded hover:bg-indigo-700/30 transition-colors"
  >
    Buscar
  </button>
</form>

  );
}
