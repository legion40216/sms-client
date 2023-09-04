import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useClassroomsContext } from "../../hooks/useClassroomsContext";

const ClassManagementList = ({classroom}) => {
    const [errorDelete, setErrorDelete] = useState(null)

    const {dispatchClassrooms} = useClassroomsContext()

    const handleClassroomDelete = async () => {
        try {
          const response = await fetch('/api/classrooms/' + classroom._id, {
           method: 'DELETE'
          })
          const json = await response.json()
    
          if(response.ok)
          {
           setErrorDelete(null)
           dispatchClassrooms({type:'DELETE_CLASSROOM', payload: json})
          }
          else {
          // Handle different HTTP status codes with specific error messages
          if (response.status === 404) {
             setErrorDelete(json.error);
           } else if (response.status === 500) {
             setErrorDelete(json.error);
           } else {
             setErrorDelete('An error occurred while deleting data from server')
           }  
          }
        }
        catch (error) {
             console.error('Error deleting classroom:', error);
             setErrorDelete("Problem connecting to server")
           }
        }
    return ( 
        <div className="flow">
        <div className="flex justify-sb align-center">
         <h2 className="fw-500">{classroom.classtitle}</h2>
         <div className="flex align-center">
            { errorDelete && <div className="error"><p>{errorDelete}</p></div>}
         <div className="cursor-pointer flex align-end" 
         onClick={() =>{handleClassroomDelete(classroom._id)}}>
                <XMarkIcon width={24}/>
         </div>
         </div>
       </div>

       <div className="grid-layout gird-column_two grid">
       {classroom.courses.map((course,index)=>(
           <div key={index} className="added-course-wrapper flex">
              <div className="added-course">
              <p>{course.courseName}</p>
              </div>
         </div> 
       ))}
       </div>
    </div>
     );
}
 
export default ClassManagementList;