import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Store, History, LogOut } from 'lucide-react';
import { useAuthStore } from '@/services/auth-store';
import toast from 'react-hot-toast';
import { logOut } from '@/services/auth';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Quản lý hàng hoá', href: '/dashboard/management-product', icon: Store },
  { title: 'Lịch sử bill', href: '/dashboard/history', icon: History },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((state) => state.setUser);

  const handleNav = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      await logOut(); // nếu có hàm clearSession từ Electron
      setUser(null);
      toast.success('Đã đăng xuất.');
      router.push('/auth');
    } catch (err) {
      console.error(err);
      toast.error('Đăng xuất thất bại.');
    }
  };

  return (
    <div className="h-full bg-gray-100 text-gray-900 flex flex-col p-2 border-r border-gray-300">
      <div className="text-lg font-bold mb-8">Dashi App</div>

      <nav className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded hover:bg-green-200 hover:text-black transition text-left w-full',
                isActive ? 'bg-green-600 font-medium text-white' : '',
              )}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-200 hover:text-black transition text-left w-full text-red-600"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
