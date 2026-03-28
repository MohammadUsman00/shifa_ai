import clsx from 'clsx'

type FlaticonIconProps = {
  icon: string
  className?: string
  'aria-hidden'?: boolean
}

export default function FlaticonIcon({
  icon,
  className,
  'aria-hidden': ariaHidden = true,
}: FlaticonIconProps) {
  return <i aria-hidden={ariaHidden} className={clsx('fi icon-inline', icon, className)} />
}
