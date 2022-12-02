import Header from "../components/header";
import { api } from "./lib";
import { createContext, FormEvent, Key, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'
import { Button } from "../components/button";
import AuthContext from "../contexts/auth";
import Link from "next/link";
import { ChatText, Pencil, Trash } from "phosphor-react";
import { GetServerSideProps } from "next";

interface PostResponseProps {
  viewAllPost: [];
  userAuth: [{
    id: string
  }];
}

interface PostProps {
  id?: string;
  title?: string
  content?: string
  comment?: []
  userId: string
} null

export default function Home(props: PostResponseProps){
  const [ post, setPost ] = useState<any>([{}])
  const [ title, setTitle ] = useState<string | undefined>('')
  const [ content, setContent ] = useState<string | undefined>('')
  const { signed, userData, auth } = useContext(AuthContext)
  const [idPost, setIdPost ] = useState('')

  const userId = props.userAuth[0].id

  useEffect(() => {
    setPost(props.viewAllPost) 
  }, [props.viewAllPost])

  async function handleNewPost(event: FormEvent) {
    event.preventDefault();

    await api.post('/post', {
      title: title,
      content: content,
      userId: userId
    })

    setPost([...post, {title: title, content: content}])

    await api.get('/post')
    .then(response => { 
      let {posts} = response.data
      setPost(posts)
    })
  }

  function handleEditPost(id: any){
    
    const postFilter = post.filter((filter: { id: any; }) => filter.id === id)
    const postEdit: PostProps = postFilter[0]
    const { title, content } = postEdit
    const input = window.document.getElementById("title-post") as HTMLInputElement | null;

    window.scroll(0,10)
    input?.focus()

    setTitle(title)
    setContent(content)

    setIdPost(id)
  }

  async function handleSaveChanges(){
    await api.put(`/post/${idPost}`, {
      title: title,
      content: content
    })

    setIdPost('')
    setTitle('')
    setContent('')

    await api.get('/post')
    .then(response => { 
      let {posts} = response.data
      setPost(posts)
    })
  }

  function handleCancel(){
    setIdPost('')
    setTitle('')
    setContent('')
  }

  async function handleDelete(id: string){
   await api.delete(`/post/${id}`)

   await api.get('/post')
    .then(response => { 
      let {posts} = response.data
      setPost(posts)
    })
  }
  
  return(
    <div className=" max-w-3xl h-screen mx-auto flex flex-col max-[600px]:mx-4">
          <div className="h-20 mt-10 mb-40">
      <form onSubmit={handleNewPost} className="flex flex-col gap-1 text-white">
          <input 
            type="text" 
            placeholder="Titulo" 
            className="px-20 py-4 bg-slate-800 text-white"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            id="title-post"
          />
          <textarea 
            placeholder="Escreva seu post aqui" 
            className="px-20 py-8 bg-slate-800 text-white resize-none"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          {!idPost
            ?
            <Button 
              className=" py-2 border-purple-100 bg-purple-600 text-white"
            > Postar
            </Button>
            :
            null
          }
          
      </form>
      {idPost 
        ? 
        <div className=" grid grid-cols-2">
          <Button
              onClick={handleSaveChanges}
              className="w-full py-2 border-purple-100 bg-purple-600 text-white"
            >
              Salvar
            </Button>
            <Button
              onClick={handleCancel}
              className="w-full py-2 border-purple-100 bg-red-600 text-white"
            >
              Cancelar
            </Button>
        </div>
        :
        null
      }
        
    </div>
    {post.slice(0).reverse().map((postRender: PostProps, index: Key) => (
      <div className="border-solid border-2 border-purple-800 p-2 text-white" key={index}>
        <strong>
          <Link href={`/post/${postRender.id}`}>{postRender.title}</Link>
        </strong>
        <p className="mt-3">
          <Link href={`/post/${postRender.id}`}>
            {postRender.content}
          </Link>
        </p>
        <div className="flex flex-row justify-end gap-5 text-purple-800">
          <Link 
            className="flex"
            href={`/post/${postRender.id}`}>
            <ChatText size={32} />
            <span className="mt-1 ml-1">{postRender.comment?.length}</span>
          </Link>
          {postRender.userId === userId 
          ?
          <>
            <Button 
              onClick={() => handleEditPost(`${postRender.id}`)}
              id="edit-button"
            > 
              <Pencil size={32} />
            </Button>
            
            <Button 
              onClick={() => handleDelete(`${postRender.id}`)}
              id="edit-button"
            > 
              <Trash size={32} />
            </Button>
          </>
          : null
          }
          
        </div>
      </div>
    ))}
  </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {['token-quikdev']: token } = parseCookies(context)
  if(!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  const [
    viewAllPostResponse,
    userAuthResponse
  ] = await Promise.all([
      api.get('/post'),
      api.post('/token', {
        token: token
      })
  ])
  return {
    props: {
      viewAllPost: viewAllPostResponse.data.posts,
      userAuth: userAuthResponse.data
    }
  }
}