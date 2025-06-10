// src/components/SearchBar.tsx
import React from 'react';

type Props = {
  query: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchBar({ query, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '0.5rem', width: '200px', marginRight: '0.5rem' }}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
