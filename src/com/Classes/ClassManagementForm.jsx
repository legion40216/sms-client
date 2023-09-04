import { useEffect, useState } from "react";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useClassroomsContext } from "../../hooks/useClassroomsContext";

const ClassManagementForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const [errorCourses, setErrorCourses] = useState(null)
    const [formError, setFormError] = useState(null)

    const [formData, setFormData] = useState({
        classtitle:"",
        course:""
     })
     const UpdateForm = (change) =>{
        setFormData((prevData)=>({...prevData, ...change}))
    }

    const {courses, dispatch} = useCoursesContext()
    const {dispatchClassrooms} = useClassroomsContext()
    const [classroomCourses, setClassroomCourses] = useState([])

    useEffect(()=>{
      const fetchcourses = async () =>{
        try {
            const response = await fetch('/api/courses');
            const json = await response.json();
        
            if (response.ok) {
              setErrorCourses(null); // Clear error state on success
              dispatch({type: 'SET_COURSES', payload: json})
            } else {
              // Handle different HTTP status codes with specific error messages
              if (response.status === 404) {
                setErrorCourses(json.error);
              } else if (response.status === 500) {
                setErrorCourses('Server error');
              } else {
                setErrorCourses('An error occurred while fetching data from server')
              }  
            }
          } catch (error) {
            // Handle network error or other exceptions
            console.error('Error fetching courses:', error);
            setErrorCourses("Problem connecting to server")
          }
        }
        fetchcourses()
      },[dispatch])

        const handleClassroomSubmit = async (e) =>{
          e.preventDefault()
          setIsSubmitting(true)
          setSuccess(null)
          const courseIds = classroomCourses.map(course => course.id);
              try {
              const response = await fetch('/api/classrooms',{
                method: 'POST',
                body: JSON.stringify({classtitle:formData.classtitle,courseIds}),
                headers: {
                  'Content-Type': 'application/json'
                }
               })
              const json = await response.json()
          
              if(response.ok)
              {
               dispatchClassrooms({type: 'CREATE_CLASSROOM', payload: json})
               setFormError(null)
               setSuccess("New class added")
               setIsSubmitting(false);
               setFormData({
                classtitle:"",
                course:""
              })
               setClassroomCourses([])
              } else {
                if (response.status === 400) {
                  setFormError(json.error); // empty form error
                }
                else if (response.status === 500) {
                  setFormError(json.error);
                } else {
                  setFormError('An error occurred while creating entrie on server')
                }    
                setIsSubmitting(false);
               }
    
            } catch (error) {
              console.error('Error uploading classroom courses:', error);
              setFormError("Problem connecting to server")
              setIsSubmitting(false);
            }
        }
    
        const handleCourseSelect = (e) =>{
          UpdateForm({course:e.target.value})
          const selectedCourseId = e.target.value;
          // Find the selected course object using its ID from the 'courses' array
          const selectedCourse = courses.find(course => course._id === selectedCourseId);
          // Check if the selected course exists and is not already in 'classroomCourses'
        
          if (selectedCourse && !classroomCourses.some(course => course.id === selectedCourse._id)) {
            setFormError(null)
            setClassroomCourses([...classroomCourses, { id: selectedCourse._id, courseName: selectedCourse.courseName }]);
          }
        }
        
          const handleCourseDelete = (index) => {
            const updatedCourses = classroomCourses.filter((_, i) => i !== index);
            setClassroomCourses(updatedCourses);
            setSuccess(null)
          } 

    return ( 
        <form action="" className="flow" onSubmit={handleClassroomSubmit}>
        <div className="flex flex-wrap">
          <div>
            <input
             type="text" 
             name='classtitle'
             placeholder='Add class name'
             value={formData.classtitle}
             onChange={(e)=>{UpdateForm({classtitle:e.target.value})}}
             required
             />
          </div>
   
          <div className="flex">
          <select value={formData.course} className={`${errorCourses ? "error_border" : ""}`} 
          onChange={(e)=>{handleCourseSelect(e)}}>
          <option value="" className="text-none">Select a course</option>
            {courses && courses.map((course)=>(
              <option
              value={course._id} 
              key={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
          { errorCourses && <div className="error"><p>{errorCourses}</p></div> }
          </div>
    
          <button type="submit" 
          data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
          disabled={isSubmitting}>
          {isSubmitting ? 'Creating Class...' : 'Create Class'}
          </button>
         </div>

         {classroomCourses.length > 0 && 
         <div className="form_course-wrapper">
            {
             classroomCourses.map((course,index)=>(
                <div className="flex align-center" key={index}>
                 <div><p className="capital">{course.courseName}</p></div>
                 <div className="cursor-pointer flex align-end" 
                 onClick={()=>{handleCourseDelete(index)}}>
                 <XMarkIcon width={18}/>
                 </div>
                </div>
              ))
            }
          </div>
          }
          {formError &&  
         <div className="error"> 
         <p>{formError}</p>
         </div>
          }
          {success && 
         <div className="success"> 
         <p>{success}</p> 
         </div>}
        </form>
     );
}
 
export default ClassManagementForm;