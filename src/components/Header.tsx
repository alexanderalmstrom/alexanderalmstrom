import { Link } from 'react-router-dom'

import { useSpace } from '../hooks/queries'

import Logo from '../images/logo.svg?react'

export default function Header() {
  const { data: space } = useSpace()

  return (
    <header className="fixed z-1000 flex h-25 w-full items-center text-[1rem] sm:h-30">
      <div className="fixed inset-y-0 left-0 -z-1 hidden h-full w-30 flex-nowrap items-center justify-center font-medium tracking-[0.2px] text-foreground sm:flex">
        <span className="block origin-center [transform:rotate(-90deg)_translateY(50%)_translateX(-18%)] whitespace-nowrap">
          Senior Frontend Engineer / Designer
        </span>
      </div>
      <div className="relative mx-auto flex w-full flex-wrap items-center justify-between px-11.25 sm:pr-15 sm:pl-13.75">
        <Link className="block size-7.5 no-underline sm:size-10" to="/">
          <Logo className="size-full fill-foreground" />
        </Link>
        <div className="hidden font-medium text-foreground">
          <span>{space?.name}</span>
        </div>
        <nav className="sm:mr-7.5">
          <ul className="mb-0 list-none">
            <li className="mb-0">
              <Link className="no-underline" to="/page/about">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
