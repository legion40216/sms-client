import {Outlet} from 'react-router-dom'


import Navbar from '../com/Navbar';
import Asidebar from '../com/Asidebar';
const RootLayout = () => {

    return ( 
       <div className='dashboard_layout container'>
       <Navbar/>
       <Asidebar/>
      <main className='bg-light-white'>
        <Outlet/>
      </main>
      </div>
     );
}
 
export default RootLayout;