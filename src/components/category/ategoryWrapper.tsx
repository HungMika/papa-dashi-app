'use client';

import { useSearchCategoryState, CategorySearchBar, CategoryListContent } from './CategoryList';

export default function CategoryWrapper() {
  const { search, setSearch, debounced } = useSearchCategoryState();

  return (
    <>
      <div className="mb-2">
        <CategorySearchBar search={search} setSearch={setSearch} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        <CategoryListContent search={debounced} />
      </div>
    </>
  );
}
