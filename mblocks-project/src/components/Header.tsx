
export const Header: React.FC<{text: string}> = (props) => {

    return (
    <div className="w-full mb-px border-solid">
        {props.text}
    </div>
  )
}
