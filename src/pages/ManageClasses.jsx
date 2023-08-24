import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";


const ManageClasses = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null)
    const [successfulSubmit, setSuccessfulSubmit] = useState(false)
    const [toggleForm, setToggleForm] = useState(false)

    const [courses, setCourses] = useState(null)
    const [arrayCourses, setArrayCourses] = useState([])
    const [classtitle, setClassTitle] = useState("")
    const [classTitleData, setClassTitleData] = useState(null)
    
    useEffect(()=>{
        const fetchcourses = async () =>{
          try {
              const response = await fetch('https://awake-sparkly-prose.glitch.me/api/courses');
              const json = await response.json();
  
              if (response.ok) {
                setCourses(json)
              } else {
                // Handle error if needed
                console.log('Error fetching courses:', json);
              }
            } catch (error) {
              // Handle network error or other exceptions
              console.error('Error fetching courses:', error);
            }
          };
          const fetchclasstitle = async () =>{
            try {
                const response = await fetch('/api/classrooms');
                const json = await response.json();
    
                if (response.ok) {
                  setClassTitleData(json)
                } else {
                  // Handle error if needed
                  console.log('Error fetching courses:', json);
                }
              } catch (error) {
                // Handle network error or other exceptions
                console.error('Error fetching courses:', error);
              }
            };
        fetchcourses()
        fetchclasstitle()
        
      },[])
   
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setIsSubmitting(true)
        setSuccessfulSubmit(false)
          const courseids = arrayCourses.map(course => course.id);
    
          try {
            const response = await fetch('/api/classrooms',{
              method: 'POST',
              body: JSON.stringify({courseids,classtitle}),
              headers: {
                'Content-Type': 'application/json'
              }
             })
            const json = await response.json()
    
            if(!response.ok)
            {
             setError(json.error)
             setIsSubmitting(false);
            }
            if(response.ok)
            {
             setError(null)
             setSuccessfulSubmit(true)
             console.log("new class added" , json)
             setArrayCourses([])
             setIsSubmitting(false);
            }
          } catch (error) {
            console.error('Error uploading classroom courses:', error);
            setError(error)
            setIsSubmitting(false);
          }
      }

  const handleCourseSelect = (e) =>{
  setSuccessfulSubmit(false)
  const selectedCourseId = e.target.value;
  // Find the selected course object using its ID from the 'courses' array
  const selectedCourse = courses.find(course => course._id === selectedCourseId);
  // Check if the selected course exists and is not already in 'arrayCourses'
  if (selectedCourse && !arrayCourses.some(course => course.id === selectedCourse._id)) {

  setArrayCourses([...arrayCourses, { id: selectedCourse._id, name: selectedCourse.course }]);
  }}

  const handleCourseDelete = (index) => {
    const updatedCourses = arrayCourses.filter((_, i) => i !== index);
    setArrayCourses(updatedCourses);
  } 

  const handleCloseBackdrop = () =>{
    setToggleForm(!toggleForm)
    setArrayCourses("")
    setSuccessfulSubmit(false)
  }

    return ( 
        <div className="container--manageclasses ">
          <div className={`create_classes__backdrop ${toggleForm ? "flex" : "dnone"}`} 
            onClick={handleCloseBackdrop}>

            <div className="create_classes bg-white flow" onClick={(e)=>{e.stopPropagation()}}>
                <div>
                  <h2 className="fw-500 uppercase">Add Class Courses</h2>
               </div>
                <form action="" className=" flex flex-column" onSubmit={handleSubmit}>
                <div>
                <select  onChange={(e)=>{setClassTitle(e.target.value)}}>
                    <option value="" className="text-none">Select a class</option>
                    <option value="class 1">class 1</option>
                    <option value="class 2">class 2</option>
                    <option value="class 3">class 3</option>
                    <option value="class 4">class 4</option>
                </select>
                </div>
                <div>
                <select onChange={(e)=>{handleCourseSelect(e)}}>
                <option value="" className="text-none">Select a course</option>
                  {courses && courses.map((course)=>(
                    <option
                    value={course._id} 
                    key={course._id}>
                      {course.course}
                    </option>
                  ))}
                </select>
                </div>
               {arrayCourses.length > 0 && 
               <div className="form_course-wrapper">
                  {
                   arrayCourses.map((course,index)=>(
                      <div className="flex align-center" key={index}>
                       <div><p className="capital">{course.name}</p></div>
                       <div className="cursor-pointer flex align-end" 
                       onClick={()=>{handleCourseDelete(index)}}>
                       <XMarkIcon width={18}/>
                       </div>
                      </div>
                    ))
                  }
                </div>
                }
                <button type="submit" 
                data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
                disabled={isSubmitting}>
                {isSubmitting ? 'Submiting...' : 'Submit'}
                </button>

                {error &&  
                <div className="error">
                  <p>{error}</p>
                </div>
                }
                {successfulSubmit &&  
                <div className="success"> 
                <p>Attendence Successfully Submited</p> 
                </div>}
                </form>
            </div>
            </div>
           
           <div className="flow">
            <div className="container-sms_content" >
             <button data-type= "primary" onClick={()=>{setToggleForm(!toggleForm)}}> 
              + Create Class Courses
             </button>
             </div>

       
              {classTitleData ?  classTitleData.map((classname)=>(
            <div key={classname._id} className="container-sms_content flow">
               <div>
                <h2 className="fw-500 uppercase">{classname.classtitle}</h2>
              </div>
              <div className="grid-layout gird-column_two grid">
              {classname.courseids.map((courseid,index)=>(
                  <div key={index} className="added-course-wrapper flex">
                     <div className="added-course">
                     <p>{courseid.course}</p>
                     </div>
                    <div className="cursor-pointer">
                         <XMarkIcon width={25}/>
                  </div>
                </div> 
              ))}
              </div>
           </div>
              ))
            :<div>Loading...</div>
            }
          </div>

        </div>
     );
}
 
export default ManageClasses;