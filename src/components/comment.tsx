import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from "next";
import { Check, Pencil, Trash } from "phosphor-react";
import { setCookie, parseCookies } from 'nookies'
import { FormEvent, useState } from "react";
import { api } from "../pages/lib";
import { Button } from "./button";

interface CommentProps {
  text: string[];
  newComment(userId: string, postId: string): Promise<void>
}

export default function Comment(props: CommentProps){
  
  //const userId = props.userAuth[0].id
  const [ comment, setComment ] = useState('')

  
  return(
    <>
      
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const {['token-quikdev']: token } = parseCookies(context)

//   if(!token) {
//     debugger
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }
//   const [
//     viewAllPostResponse,
//     userAuthResponse
//   ] = await Promise.all([
//       api.get('/post'),
//       api.post('/token', {
//         token: token
//       })
//   ])
//   console.log(userAuthResponse.data.id)
//   return {
//     props: {
//       viewAllPost: viewAllPostResponse.data.posts,
//       userAuth: userAuthResponse
//     }
//   }
// }