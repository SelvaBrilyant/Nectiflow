'use client';

import { usePathname } from 'next/navigation';
import BaseLayout from './BaseLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  return isAuthRoute ? children : <BaseLayout>{children}</BaseLayout>;
};

export default ClientLayout; 