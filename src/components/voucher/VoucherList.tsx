'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherService } from '@/services/vounchers';
import { Voucher } from '@/data/types';
import toast from 'react-hot-toast';
import LoaderSpinner from '../Loader';
import VoucherItem from './VoucherItem';
import { Input } from '../ui/input';
import useDebounce from '@/hooks/use-debounce';

export function useSearchState() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  return { search, setSearch, debounced };
}

export function SearchBar({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <Input
      placeholder="Tìm voucher theo tên..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full max-w-md"
    />
  );
}

export function VoucherListContent({ search }: { search: string }) {
  const queryClient = useQueryClient();

  const { data: vouchers = [], isLoading } = useQuery<Voucher[]>({
    queryKey: ['vouchers', search],
    queryFn: () => voucherService.getAll(search),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => voucherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Xoá voucher thành công');
    },
  });

  if (isLoading) return <LoaderSpinner />;
  if (vouchers.length === 0) return <p className="text-sm text-gray-500">Không tìm thấy voucher nào.</p>;

  return (
    <div className="space-y-2">
      {vouchers.map((voucher) => (
        <VoucherItem key={voucher.id} voucher={voucher} onDelete={() => deleteMutation.mutate(voucher.id)} />
      ))}
    </div>
  );
}
