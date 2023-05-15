import { Link, useNavigate } from 'react-router-dom'
import Button from './Button';

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-row justify-between px-4 py-8 border-b-2 border-zinc-700 items-center text-xl">
      <Link to={'/'}>ZapGate.It</Link>
      <Button text="Try it!" onClick={() => {navigate('upload')}}/>
    </nav>
  )
}

export default Navbar