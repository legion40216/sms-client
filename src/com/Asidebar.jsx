import {Link} from 'react-router-dom'
import { useState } from 'react';
import { ChevronDownIcon,ChevronUpIcon,UserIcon } from '@heroicons/react/24/solid'
const Asidebar = () => {
    const [dropDownActive, setDropDownActive] = useState(null)

 
    const handleButtonSidebar = (value) => {

      const activeButton =  value;

      if(dropDownActive === value )
      {
        setDropDownActive(null);
      }
      else{
        setDropDownActive(activeButton);
      }
   
    };

    return ( 
        <aside>
        <div>
          <ul className="dashboard_sidebar">
            <li>
              <button
              data-type="sidebar_dropdown" 
              aria-expanded={dropDownActive === "students" ? "false" : "true"}  
              onClick={()=>{handleButtonSidebar("students")}}>
              Students
              {dropDownActive === "students"? <ChevronUpIcon width={15}/>: <ChevronDownIcon width={15}/>}
              </button>

              <button
              data-type="sidebar_mobile" 
              aria-expanded={dropDownActive === "students" ? "false" : "true"} 
              onClick={()=>{handleButtonSidebar("students")}}
              >
              
              <UserIcon width={25}/>
              </button>

              <ul className={` ${dropDownActive === "students" ? "dropdown_submenu" : "dnone" }`}>
                <li> <Link to ="/addstudent">Add Student</Link></li>
                <li> <Link to ="/showallstudents">Show All Stundent</Link></li>
                <li> <Link to ="/addattendence">Add Attendence</Link></li>
                <li> <Link to ="/attendence">Attendence</Link></li>
              </ul>
            </li>

            <li>
              <button
              data-type="sidebar_dropdown" 
              aria-expanded={dropDownActive === "staff" ? "false" : "true"}  
              onClick={()=>{handleButtonSidebar('staff')}}>
              Staff
              {dropDownActive === "staff" ? <ChevronUpIcon width={15}/> : <ChevronDownIcon width={15}/> }
              </button>

              <button 
              data-type="sidebar_mobile" 
              aria-expanded={dropDownActive === "staff" ? "false" : "true"} 
              onClick={()=>{handleButtonSidebar('staff')}}
              >
              <UserIcon width={25}/>
              </button>

              <ul className={` ${dropDownActive === "staff" ? "dropdown_submenu" : "dnone" }`}>
                <li> <Link to ="/addteacher">Add Teachers</Link></li>
              </ul>
            </li>

            <li>
              <button
              data-type="sidebar_dropdown" 
              aria-expanded={dropDownActive === "miscellaneous" ? "false" : "true"}  
              onClick={()=>{handleButtonSidebar('miscellaneous')}}>
              miscellaneous
              {dropDownActive === "miscellaneous" ? <ChevronUpIcon width={15}/> : <ChevronDownIcon width={15}/> }
              </button>

              <button 
              data-type="sidebar_mobile" 
              aria-expanded={dropDownActive === "miscellaneous" ? "false" : "true"} 
              onClick={()=>{handleButtonSidebar('miscellaneous')}}
              >
              <UserIcon width={25}/>
              </button>

              <ul className={` ${dropDownActive === "miscellaneous" ? "dropdown_submenu" : "dnone" }`}>
                <li> <Link to ="/managecourses">Manage Courses</Link></li>
                <li> <Link to ="/manageclasses">Manage Class</Link></li>
              </ul>
            </li>
          </ul>
        </div>
        </aside>
     );
}
 
export default Asidebar;