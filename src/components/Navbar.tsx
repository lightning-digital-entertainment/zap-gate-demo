import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-row justify-between px-4 py-8 border-b-2 border-zinc-700 items-center">
      <h1 className="text-xl">ZapGate.It</h1>
      <button className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600" onClick={() => {navigate('upload')}}>Try it!</button>
    </nav>
  )
}

export default Navbar