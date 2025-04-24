'use client'

import Link from 'next/link'
import { Users, ShoppingCart, Table, House, Utensils, UserCircle2 } from 'lucide-react'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'

export default function DashNavBar() {
  const pathname = usePathname()
  const current = pathname.split('/').pop()

  const navItems = [
    { href: '/business', icon: House },
    { href: '/business/user', icon: Users },
    { href: '/business/order', icon: ShoppingCart },
    { href: '/business/table', icon: Table },
    { href: '/business/item', icon: Utensils },
    { href: '/account', icon: UserCircle2 },
  ]

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-3xl bg-transparent">
        <nav className="flex bg-transparent justify-center px-4 py-4.5">
          <div className="w-full max-w-md flex items-center justify-between bg-white/90 backdrop-blur ring-1 ring-gray-200 rounded-full px-6 py-4">
            {navItems.map(({ href, icon: Icon }) => {
              const isActive = current === href.split('/').pop()
              return (
                <Link
                  key={href}
                  href={href}
                  className={classNames(
                    'flex flex-col items-center text-xs gap-1 flex-1 transition-colors',
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-500 hover:text-blue-500'
                  )}
                >
                  <Icon size={20} />
                </Link>
              )
            })}
          </div>
        </nav>
      </header>
  
      <div className="h-[72px]" />
    </>
  )
}