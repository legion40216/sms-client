import { useEffect, useState } from "react";
import { useCoursesContext } from "../hooks/useCoursesContext";

import CourseForm from "../com/Course/CourseForm";
import CourseList from "../com/Course/CourseList";

const CourseManagement = () => {
    const [error, setError] = useState(null)
    const {courses, loading, dispatch} = useCoursesContext()

    useEffect(()=>{
        const fetchcourses = async () =>{
          dispatch({ type: 'SET_LOADING' });
          try {
              const response = await fetch('/api/courses');
              const json = await response.json();

              if (response.ok) {
                setError(null); // Clear error state on success
                dispatch({type: 'SET_COURSES', payload: json})
              } else {
                // Handle different HTTP status codes with specific error messages
                if (response.status === 404) {
                  setError(json.error);
                } else if (response.status === 500) {
                  setError('Server error');
                } else {
                  setError('An error occurred while fetching data from server')
                }  
              }
            } catch (error) {
              // Handle network error or other exceptions
              console.error('Error fetching courses:', error);
              setError("Problem connecting to server")
            }
          };
        fetchcourses()
      },[dispatch])
   
    return ( 
        <div className="flow">
        <div className="sms_table-options">
         <CourseForm />
        </div>
        <div className="error_notfication">
            {
             error && !courses.length > 0 &&  <div className="error"><p>{error}</p></div>
            }
            </div>
        <div>
          {!error &&
            loading ? (
              <div>Loading...</div>
              ) : (
                courses.length > 0 &&
                <div className="container-sms_content container--managecourse flow">
                <div>
                  <h2 className="fw-500 uppercase">manage courses</h2>
                </div>
              <div className="gird-column_two grid">
               {courses.map((course) => (
                <CourseList course={course} key={course._id}/>
                ))
               } 
            </div>
           </div>
           )
           }
   </div>
 </div>
     );
}
 
export default CourseManagement;