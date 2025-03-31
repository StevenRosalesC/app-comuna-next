import { z } from "zod"


const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})


export default function InsertPersonForm() {
  return (
    <div>
      <h1>Insert Person Form</h1>
    </div>
  )
}
