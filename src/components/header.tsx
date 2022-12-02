import Link from "next/link"
import  Router  from "next/router"
import { destroyCookie } from 'nookies'
import { HouseLine } from "phosphor-react"

export default function Header() {
  function handleLogout(){
    destroyCookie(undefined, 'token-quikdev')
    Router.push('/home')
  }
  return(
    <div className=" w-3/4 h-10 border-solid border-purple-100 mx-auto mt-4">
      <ul className="text-white flex flex-row gap-4 p-2 pr-10 justify-between">
        <li>
          <Link 
            href="/home"
            className="flex flex-row items-center gap-2 pl-4 hover:opacity-30"
          >
            <HouseLine size={24} />Home</Link>
        </li>
        <li>
          <Link 
            href="#" 
            className=" font-light text-sm underline"
            onClick={handleLogout}
          >
            Sair
          </Link>
        </li>
      </ul>
    </div>
  )
}