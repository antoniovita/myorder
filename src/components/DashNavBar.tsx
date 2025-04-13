'use client'

import Link from 'next/link'
import { Users, ShoppingCart, Table, House, Utensils } from 'lucide-react'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'

export default function DashNavBar() {
  const pathname = usePathname()
  const current = pathname.split('/').pop()

  const navItems = [
    { label: 'Dashboard', href: '/business', icon: House },
    { label: 'Usuarios', href: '/business/user', icon: Users },
    { label: 'Pedidos', href: '/business/order', icon: ShoppingCart },
    { label: 'Mesas', href: '/business/table', icon: Table },
    { label: 'Itens', href: '/business/item', icon: Utensils },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-5 sm:flex sm:justify-around text-xs sm:text-sm">
          {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = current === href.split('/').pop()

            return (
              <div key={label}>
                <Link
                  key={label}
                  href={href}
                  className={classNames(
                    'flex flex-col items-center gap-1 px-2 py-2 transition-all',
                    isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-500'
                  )}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
