import type { BulletProps } from './Bullet.types'

const Bullet = ({ percent, onMouseDown, testId }: BulletProps) => (
  <div
    className="absolute top-1/2 w-5 h-5 bg-white border-2 border-[#e94560] rounded-full -translate-x-1/2 -translate-y-1/2 cursor-grab transition-[transform,box-shadow] duration-150 ease-in-out z-10 hover:scale-[1.35] hover:shadow-[0_0_0_6px_rgba(233,69,96,0.15)] active:scale-[1.2] active:cursor-grabbing"
    style={{ left: `${percent}%` }}
    onMouseDown={onMouseDown}
    data-testid={testId}
    role="slider"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(percent)}
  />
)

export default Bullet
