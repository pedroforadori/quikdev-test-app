interface ValidatorProps {
  text: String
}

export default function Validator(props: ValidatorProps){
  return (
    <span className=" text-red-600">{props.text}</span>
  )
}