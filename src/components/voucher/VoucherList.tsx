'use client';

import { Voucher } from '@/data/types';
import { voucherService } from '@/services/vounchers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoaderSpinner from '../Loader';
import VoucherItem from './VoucherItem';

export default function VoucherList() {
  const queryClient = useQueryClient();

  const { data: vouchers = [], isLoading } = useQuery<Voucher[]>({
    queryKey: ['vouchers'],
    queryFn: () => voucherService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => voucherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Xoá voucher thành công');
    },
  });

  if (isLoading) return <LoaderSpinner />;

  return (
    <div className="space-y-2 max=h=[450px] overflow-hidden">
      {vouchers.map((voucher) => (
        <VoucherItem key={voucher.id} voucher={voucher} onDelete={() => deleteMutation.mutate(voucher.id)} />
      ))}
    </div>
  );
}
