import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from "react";
import { api } from "../pages/lib";
import { setCookie, parseCookies } from 'nookies'
export interface AuthContextData {
  signed: boolean
  userData: {
    id: string,
    name: string,
    email: string
  } | null
  auth(user: string, password: string): Promise<void>
  newUser(name: string, email: string, password: string): Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser ] = useState<null>(null)
  const router = useRouter();

  useEffect(() => {
    const { 'token-quikdev': token } = parseCookies()

    if(token){
      api.post('/token', {
        token: token
      }).then(response => {
        setUser(response.data)
      })
    }
    

  }, [])

  async function auth(user: string, password: string) {
    api.post('/auth', {
      email: user,
      password: password
    }).then(response => {
      let { data } = response
    
      if(data){
        setUser(data)
        setCookie(undefined, 'token-quikdev', data.validateToken, {
          maxAge: 60 * 60 * 1 // 1 hora
        })
        router.push('/home')
      }
    });
  }

  async function newUser(name: string, email: string, password: string) {
    await api.post('/user', {
      name: name,
      email: email,
      password: password
    }).then(response => {
        let {email, password} = response.data 
        
        auth(email, password)

        if(email && password){
          router.push('/home')
        } else {
          return
        }
      });
  }

  return(
    <AuthContext.Provider value={{signed: !!user, userData: user, auth, newUser}}> 
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;