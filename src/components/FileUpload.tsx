import { InputGroup } from "@chakra-ui/react";
import { useRef } from "react";

type FileUploadProps = {
  register: any; // declare register props
  accept: string,
  multiple: boolean,
  children: React.ReactNode
}

// https://gist.github.com/Sqvall/23043a12a7fabf0f055198cb6ec39531
const FileUpload = ( { register, accept, multiple, children}: FileUploadProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register

  const handleClick = () => inputRef.current?.click()

  return (
      <InputGroup onClick={handleClick}>
        <input
          type={'file'}
          multiple={multiple || false}
          hidden
          accept={accept}
          // register={register}
          {...rest}
          ref={(e) => {
            ref(e)
            inputRef.current = e
          }}
        />
        <>
          {children}
        </>
      </InputGroup>
  )
}

export default FileUpload;