import { GetServerSideProps, GetStaticProps } from "next";
import { Check, Pencil, Trash} from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/button";
import { parseCookies } from 'nookies'
import { api } from "../lib";
import { useRouter } from 'next/router';

interface PostProps {
  id: string;
  title: string;
  content: string;
  comment: [{
    id: string;
    content: string;
    userId: string;
  }];
  text: string[];
  userAuth: [{
    id: string
  }];
  token: string
  
}

export default function Post(props: PostProps){
  const [ comment, setComment ] = useState([{
    id: '',
    content: '',
    userId: ''
  }])
  const [ commentText, setCommentText ] = useState('')
  const mapComment = props.comment?.map(comments => comments) 
  const [idComment, setIdComment] = useState('')
  const [layoutButton, setLayoutButton] = useState('')
  const [ userId, setUserId ] = useState('')

  const {['token-quikdev']: token } = parseCookies()
  
  useEffect(() => {
    setComment(mapComment)
    api.post('/token', {
        token: token
    }).then(response => { 
      let {id} = response.data[0]
      debugger
      setUserId(id)
    })
  }, [])

  async function handleNewComment(event: FormEvent){
    event.preventDefault();
  
    await api.post('/comment', {
      content: commentText,
      userId: userId,
      postId: props.id
    })

    setComment([...comment, {id: idComment, content: commentText, userId: userId}])

    await api.get(`/post/${props.id}`)
    .then(response => { 
      setCommentText('')
    })
  }

  function handleEditComment(id: any){
    const commentEdit = comment.filter(selectComment => selectComment.id == id)
    const input = window.document.getElementById("comment") as HTMLInputElement | null;
    setCommentText(commentEdit[0].content)

    window.scroll(0,10)
    input?.focus()

    setLayoutButton(id)
    setIdComment(id)
  }

  async function handleSaveChanges(event: FormEvent){
    event.preventDefault();

    await api.put(`/comment/${idComment}`, {
      content: commentText
    })

    setLayoutButton('')
    setCommentText('')

    await api.get(`/post/${props.id}`)
    .then(response => { 
      let {comment} = response.data
      setComment(comment)
    })
  }

  function handleCancel(){
    setLayoutButton('')
    setCommentText('')
  }

  async function handleDelete(id: string){
    await api.delete(`/comment/${id}`)

    await api.get(`/post/${props.id}`)
     .then(response => { 
       let {comment} = response.data
       setComment(comment)
     })
   }
  
  return(
      <div className="flex flex-col justify-center w-1/2 mx-auto text-white gap-4 mt-4 text-justify ">
        <h1 className="text-5xl text-center">{props.title}</h1>
        <p className="text-lg">
          {props.content}
        </p>
        <form className="flex items-center gap-4">
          <input 
            type="text"
            placeholder="Digite seu comentario aqui"
            className="py-4 pl-2 flex-1 placeholder-white bg-slate-800"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            id="comment"
          />
          {!layoutButton
          ?
            <Button 
              className="bg-purple-900 py-3 px-4"
              onClick={handleNewComment}
            >
              <Check size={32}/>
            </Button>
          : 
          <div className="flex gap-2">
            <Button 
              className="bg-purple-900 py-3 px-4"
              onClick={handleSaveChanges}
            >
                <Check size={32}/>
            </Button>
            <Button 
              className="bg-red-600 py-3 px-4"
              onClick={handleCancel}
            >
                <Trash size={32}/>
            </Button>
          </div>
        }         
         
        </form>
          <h2 className="mt-6 text-2xl">Comentários ({comment.length})</h2>
            {comment.slice(0).reverse().map((comments, key) => (
              <ul className="list-disc pl-6" key={key}>
                <li className="mb-6">
                  {comments.content}
                <span className="flex flex-row gap-2">
                  {userId === comments.userId 
                  ?
                  <>
                    <Button
                    onClick={() => handleEditComment(`${comments.id}`)}
                    >
                      <Pencil size={20} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(`${comments.id}`)}
                    >
                    <Trash size={20} />
                    </Button>
                  </>
                  : null
                  }            
                </span>
                </li>
              </ul>
            ))}
        </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {['token-quikdev']: token } = parseCookies(context)
  const id = context.params?.id
  if(!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  
  const [
    viewDetailPostResponse,
  ] = await Promise.all([
      api.get(`post/${id}`)
  ])

  const { title, content, comment, userId } = viewDetailPostResponse.data
  return {
    props: {
      id: id,
      title: title,
      content: content,
      comment: comment,
      userId: userId
    }
  }
}