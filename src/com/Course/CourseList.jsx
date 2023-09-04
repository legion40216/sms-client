import { useState } from "react";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import { XMarkIcon } from '@heroicons/react/24/outline';

const CourseList = ({course}) => {
    const {dispatch} = useCoursesContext()
    const [errorDelete, setErrorDelete] = useState(null)

      const handleCourseDelete = async () =>{
     try {
       const response = await fetch('/api/courses/' + course._id, {
        method: 'DELETE'
       })
       const json = await response.json()

       if(response.ok)
       {
        setErrorDelete(null)
        dispatch({type:'DELETE_COURSE', payload: json})
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
          console.error('Error deleting course:', error);
          setErrorDelete("Problem connecting to server")
        }
}

    return ( 
           
             <div className="flow">
              <div className="added-course-wrapper flex">
              <div className="added-course">
               <p>{course.courseName}</p>
              </div>
             <div className="cursor-pointer" onClick={handleCourseDelete}>
                  <XMarkIcon width={25}/>
             </div>
             </div>
             { errorDelete &&  <div className="error"><p>{errorDelete}</p></div>    }
             </div> 
     );
}
 
export default CourseList;