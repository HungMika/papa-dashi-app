'use client';

import { useSearchState } from './ProductList';
import { SearchBar, ProdList } from './ProductList';

export default function ProductWrapper() {
  const { search, setSearch, debounced } = useSearchState();

  return (
    <>
      <div className="mb-2">
        <SearchBar search={search} setSearch={setSearch} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        <ProdList search={debounced} />
      </div>
    </>
  );
}
