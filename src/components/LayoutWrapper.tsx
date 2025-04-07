'use client';

import { usePathname } from 'next/navigation';
import NavBar from './navBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutPages = [
    "/provider-page",
  ];

  const shouldRenderLayout = !noLayoutPages.some((path) => pathname.startsWith(path));

  return (
    <>
      {shouldRenderLayout && <NavBar />}
      {children}
    </>
  );
}
