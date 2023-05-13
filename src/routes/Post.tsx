import { useLoaderData } from "react-router-dom"

function Post() {
  const data = useLoaderData();
  console.log(data)
  return (
    <div>Post</div>
  )
}

export default Post