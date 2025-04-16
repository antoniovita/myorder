'use client'

import Link from 'next/link'
import { Users, ShoppingCart, Table, House, Utensils } from 'lucide-react'
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
  ]

  return (
    <div className='bg-gray-100 py-4'>
    <nav className="w-full flex justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-full px- py-4 backdrop-blur-md">
        <div className="flex justify-between items-center">
          {navItems.map(({ href, icon: Icon }) => {
            const isActive = current === href.split('/').pop()

            return (
              <Link
                key={href}
                href={href}
                className={classNames(
                  'flex flex-col items-center text-xs gap-1 flex-1 transition-all',
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-500'
                )}
              >
                <Icon size={20} />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
    </div>
  )
}
