'use client';

import { useSearchState, SearchBar, VoucherListContent } from './VoucherList';

export default function VoucherWrapper() {
  const { search, setSearch, debounced } = useSearchState();

  return (
    <>
      <div className="mb-2">
        <SearchBar search={search} setSearch={setSearch} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        <VoucherListContent search={debounced} />
      </div>
    </>
  );
}
