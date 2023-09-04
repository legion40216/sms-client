import { useState } from "react";
import { useCoursesContext } from "../../hooks/useCoursesContext";

const CourseForm = () => {

    const [success, setSuccess] = useState(null);
    const [formError, setFormError] = useState(null)

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        courseName:""
     })

     const UpdateForm = (change) =>{
        setFormData((prevData)=>({...prevData, ...change}))
    }

    const {dispatch} = useCoursesContext()

    const handleCourseSubmit = async (e) =>{
        e.preventDefault() 
        setIsSubmitting(true)
        setSuccess(null)
        try {
          const response = await fetch('/api/courses',{
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
              'Content-Type': 'application/json'
            }
           })
          const json = await response.json()
  
          if(response.ok)
          {
            dispatch({type: 'CREATE_COURSE', payload: json})
            setFormData({
              courseName:"",
            });
            setIsSubmitting(false);
            setFormError(null)
            setSuccess("New course added")
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
        }
        catch (error) {
          console.error('Error uploading new course:', error);
          setFormError('Error uploading courses')
          setIsSubmitting(false);
        }
      }

    return ( 
  
        <form action="" className="flex" onSubmit={handleCourseSubmit}>
        <div className="flex">
        <div>
            <input
              type="text" 
              name='courseName'
              placeholder='Add Course'
              value={formData.courseName}
              onChange={(e)=>{UpdateForm({courseName:e.target.value})}}
              required
              />
        </div>
        <button type="submit" 
        data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
        disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add'}
        </button>
        </div>

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
 
export default CourseForm ;