import {Link} from 'react-router-dom'
import { BellAlertIcon,MoonIcon } from '@heroicons/react/24/outline'
const Navbar = () => {
    return ( 
        <nav className='flex'>
        <div className='logo'>
        <h1 className='fs-400 fw-500 '><Link to ="/">Dashboard</Link></h1>
        </div>
        <div className='flex align-center'>
        <button  data-type="nav-icon" ><MoonIcon width={23}/></button>
         <button  data-type="nav-icon" ><BellAlertIcon width={23}/></button>
         <button data-type="nav-logout">logout</button>
        </div>
        </nav>
     );
}
 
export default Navbar;