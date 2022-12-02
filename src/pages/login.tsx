import Image from "next/image"
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useContext, createContext } from "react"
import { setCookie, parseCookies } from 'nookies'
import logo from '../assets/logo-purple.png'
import { Button } from "../components/button"
import Validator from "../components/validator"
import { api } from "./lib"
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from "../contexts/auth"
import { GetServerSideProps } from "next"

export default function Login() {
  const [ newUserUi, setNewUserUi ] = useState(false)
  const [ user, setUser ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ validate, setValidate ] = useState(false)
  const [ registerName, setRegisterName ] = useState('')
  const [ registerEmail, setRegisterEmail ] = useState('')
  const [ registerPassword, setRegisterPassword ] = useState('') 
  const [ registerRepeatPassword, setRegisterRepeatPassword ] = useState('')
  const { signed, userData, auth, newUser } = useContext(AuthContext)
  const router = useRouter()
  
 interface User {
    id: string
    name: string
    email: string
  }

  function handleNewUser(event: FormEvent) {
    event?.preventDefault()

    if(newUserUi){
      setNewUserUi(false)
    }else{
      setNewUserUi(true)
    }
  }

  function handleAuth(event: FormEvent) {
    event?.preventDefault()

    if(!user || !password){
      toast('Algum campo esta em branco')
    }else {
      auth(user, password)
    }
      
    //  api.post('/auth', {
    //     email: user,
    //     password: password
    //   }).then(response => {
    //     let { validateUser } = response.data
    //     if(validateUser){
    //       router.push('/home')
    //     } else {
    //       toast('Usuario e senha invalidos')
    //       return
    //     }
    //   });
    // }else{
    //   toast('Algum campo esta em branco')
    // }
}

  async function createNewUser(event: FormEvent) {
    event.preventDefault()

    if(registerPassword !== registerRepeatPassword){
      toast('Senhas nao sao iguais')
      return
    }
    newUser(registerName, registerEmail, registerPassword)

  }

  return (
      <div className="max-w-2xl mx-auto my-auto mt-40">
      <main className="bg-white flex flex-col items-center rounded">
        <Image 
          src={logo} 
          alt="" 
          className="my-10"  
        />
        { newUserUi === false ?
        <>
          <form onSubmit={handleAuth} className="flex flex-col gap-2">
            <input 
              type="text"  
              placeholder="Seu Email" 
              className="px-16 py-2 border-gray-100 bg-gray-100 rounded align-middle"
              value={user}
              onChange={(event) => setUser(event.target.value)}
            />
            <input 
              type="password" 
              placeholder="Sua Senha"
              className="px-16 py-2 border-gray-100 bg-gray-100 rounded align-middle"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              type="submit" 
              className="px-16 py-2 border-purple-100 bg-purple-600 text-white"
            >
              Entrar
            </Button>
            <input 
              
            /> 
            <Toaster />
            </form>
            <div className="my-10 flex items-center flex-col">
              <p>Nao tem uma conta?</p>
              <Button 
                onClick={handleNewUser} 
                className="text-purple-600"
              >
                Criar conta
              </Button>
            </div>
          </>
          :
          <> 
            <form onSubmit={createNewUser} className="flex flex-col gap-2">
              <input 
                type="text"  
                placeholder="Nome completo" 
                className="px-16 py-2 border-gray-100 bg-gray-100 rounded align-middle"    
                value={registerName}       
                onChange={(event) => setRegisterName(event.target.value)} 
              />
              <input 
                type="email"  
                placeholder="Email" 
                className="px-16 py-2 border-gray-100 bg-gray-100 rounded align-middle"
                value={registerEmail}       
                onChange={(event) => setRegisterEmail(event.target.value)}             
              />
              <input 
                type="password" 
                placeholder="Nova senha"
                className="px-16 py-2 border-gray-100 bg-gray-100 rounded align-middle"
                value={registerPassword}       
                onChange={(event) => setRegisterPassword(event.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Repetir nova senha"
                className="px-16 py-2 border-gray-100 bg-gray-100 rounded align-middle"
                value={registerRepeatPassword}       
                onChange={(event) => setRegisterRepeatPassword(event.target.value)} 
              />
              <Button 
                type="submit"
                className="px-16 py-2 border-purple-100 bg-purple-600 text-white"
              >Criar
              </Button>
              <Toaster />
            </form> 
            <div className="my-10 flex items-center flex-col">
              <p>Ja tem uma conta?</p>
              <a href="" onClick={handleNewUser} className="text-purple-600">Fazer login</a>
            </div>
          </>
        }
      </main>
    </div>    
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {['token-quikdev']: token } = parseCookies(context)
  if(token) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    }
  }
  return {
    props: {
    }
  }
}