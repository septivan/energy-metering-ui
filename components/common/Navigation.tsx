'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/timeseries', label: 'Time Series' },
  { href: '/billing', label: 'Billing' },
  { href: '/anomalies', label: 'Anomalies' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-title">Energy Metering</h1>
        <div className="nav-links">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
