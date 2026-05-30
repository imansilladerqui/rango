import { NavLink } from 'react-router-dom'

const NotFound = () => (
  <div className="flex flex-col items-center justify-center gap-6 text-center">
    <p className="text-[8rem] font-black text-[#e94560] leading-none">404</p>
    <h1 className="text-2xl font-bold text-[#1a1a2e]">Page not found</h1>
    <p className="text-[#666666] max-w-xs">
      The page you are looking for does not exist.
    </p>
    <NavLink
      to="/exercise1"
      className="mt-2 px-6 py-3 bg-[#e94560] text-white text-sm font-semibold rounded-lg hover:bg-[#c73652] transition-colors duration-200"
    >
      Go to Exercise 1
    </NavLink>
  </div>
)

export default NotFound
