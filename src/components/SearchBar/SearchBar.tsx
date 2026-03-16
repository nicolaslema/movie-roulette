// src/components/SearchBar.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

type Props = {
  query: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchBar({ query, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2 rounded-xl border border-zinc-700/70 bg-zinc-900/80 px-3 py-2">
      <FaSearch className="text-zinc-500" />
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
      />
    </form>
  );
}
