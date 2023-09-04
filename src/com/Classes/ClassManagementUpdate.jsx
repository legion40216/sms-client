import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useClassroomsContext } from "../../hooks/useClassroomsContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";

const ClassManagementUpdate = ({classroom}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const [formError, setFormError] = useState(null)

    const [formData, setFormData] = useState({
        classtitle:classroom.classtitle,
        course:""
     })
     const UpdateForm = (change) =>{
        setFormData((prevData)=>({...prevData, ...change}))
    }

    const {dispatchClassrooms} = useClassroomsContext()
    const [classroomCourses, setClassroomCourses] = useState([...classroom.courses])
  
    const {courses} = useCoursesContext()

    const handleClassroomSubmit = async (e) =>{
        e.preventDefault()
        setIsSubmitting(true)
        setSuccess(null)
        const courseIds = classroomCourses.map(course => course._id);
         try{
            const response = await fetch('/api/classrooms/'+ classroom._id,{
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({classtitle:formData.classtitle,courseIds}),
             })
            const json = await response.json()
            if(response.ok)
            {
             dispatchClassrooms({type: 'UPDATE_CLASSROOM', payload: json})
             setFormError(null)
             setSuccess("class updated added")
             setIsSubmitting(false);
            } else {
              if (response.status === 400) {
                setFormError(json.error); // empty form error
              }
              else if (response.status === 500) {
                setFormError(json.error);
              } else {
                setFormError('An error occurred while updating entrie on server')
              }    
              setIsSubmitting(false);
             }
  
          } catch (error) {
            console.error('Error updating classroom courses:', error);
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
   
        if (selectedCourse && !classroomCourses.some(course => course._id === selectedCourse._id)) {
          setFormError(null)
          setClassroomCourses([...classroomCourses, { _id: selectedCourse._id, courseName: selectedCourse.courseName }]);
        }
      }

        const handleCourseDelete = (index) => {
        const updatedCourses = classroomCourses.filter((_, i) => i !== index);
          setClassroomCourses(updatedCourses);
          setSuccess(null)
        } 
  
    return ( 
        <div className="update_classes bg-white flow" onClick={(e)=>{e.stopPropagation()}}>
        <div>
           <h2 className="fw-500 uppercase">Edit Class Courses</h2>
        </div>
         <form action="" className="flow" onSubmit={handleClassroomSubmit}>
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

         <div className="flow_half">
         <select value={formData.course} onChange={(e)=>{handleCourseSelect(e)}}>
         <option value="" className="text-none">Select a course</option>
           {courses && courses.map((course)=>(
             <option
             value={course._id} 
             key={course._id}>
               {course.courseName}
             </option>
           ))}
         </select>
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

       <div className="flex justify-sb"> 
       {formError &&  
        <div className="error"> 
        <p>{formError}</p>
        </div>
         }

         {success && 
        <div className="success"> 
        <p>{success}</p> 
        </div>}

        <button type="submit" 
         data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
         disabled={isSubmitting}>
         {isSubmitting ? 'Submiting...' : 'Submit'}
         </button>
       </div>
        </form>
     </div>
     );
}
 
export default ClassManagementUpdate;