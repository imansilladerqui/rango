import { NavLink } from 'react-router-dom'
import type { NavBarProps } from './NavBar.types'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-block text-sm font-medium py-4 px-5 border-b-[3px] transition-[color,border-color] duration-200 no-underline ${
    isActive ? 'text-white border-[#e94560]' : 'text-[#aaaaaa] border-transparent hover:text-white'
  }`

const NavBar = ({ items }: NavBarProps) => (
  <nav className="bg-[#1a1a2e] px-8 flex gap-2">
    {items.map(({ to, label }) => (
      <NavLink key={to} to={to} className={navLinkClass}>
        {label}
      </NavLink>
    ))}
  </nav>
)

export default NavBar
