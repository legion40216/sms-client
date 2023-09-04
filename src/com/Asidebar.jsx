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
                <li> <Link to ="/viewallstudents">View All Stundent</Link></li>
                <li> <Link to ="/addattendence">Add Attendence</Link></li>
                <li> <Link to ="/attendancerecords">Attendance Records</Link></li>
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
              aria-expanded={dropDownActive === "management" ? "false" : "true"}  
              onClick={()=>{handleButtonSidebar('management')}}>
              management
              {dropDownActive === "management" ? <ChevronUpIcon width={15}/> : <ChevronDownIcon width={15}/> }
              </button>

              <button 
              data-type="sidebar_mobile" 
              aria-expanded={dropDownActive === "management" ? "false" : "true"} 
              onClick={()=>{handleButtonSidebar('management')}}
              >
              <UserIcon width={25}/>
              </button>
              
              <ul className={` ${dropDownActive === "management" ? "dropdown_submenu" : "dnone" }`}>
              <li> <Link to ="/classmanagement">Class Management</Link></li>
              <li> <Link to ="/coursemanagement">Course Managment</Link></li>
              </ul>
            </li>
          </ul>
        </div>
        </aside>
     );
}
 
export default Asidebar;