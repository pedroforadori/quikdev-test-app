import { GetServerSideProps } from "next/types";
import { parseCookies } from 'nookies'
import Login from "./login";

export default function Index() {
  return <Login />
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