import { useState,useEffect } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';

const ManageCourses = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courses, setCourses] = useState(null)
    const [course, setCourse] = useState("")
    const [error, setError] = useState(null)

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
      fetchcourses()
    },[])

    const handleSubmit = async (e) =>{
      e.preventDefault() 
      setIsSubmitting(true)
        const response = await fetch('https://awake-sparkly-prose.glitch.me/api/courses',{
          method: 'POST',
          body: JSON.stringify({course}),
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
         console.log("new course added" , json)
         setCourse("")
         setIsSubmitting(false);
        }
        setIsSubmitting(false);
    }
   
    const handleDelete = async () =>{

    }

    return ( 
        <div className="flow">
            <div className="sms_table-options">
                <form action="" className="flex" onSubmit={handleSubmit}>
                <div>
                    <input
                      type="text" 
                      name='coursename'
                      placeholder='Add Course'
                      value={course}
                      onChange={(e)=>{setCourse(e.target.value)}}
                      required
                      />
                </div>
                <button type="submit" 
                data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
                disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add'}
                </button>

                {error &&  
                <div className="error"> 
                 <p>{error}</p>
                </div>
                }
                </form>
            </div>

        <div className="container-sms_content container--managecourse flow">
          <div>
            <h2 className="fw-500 uppercase">manage courses</h2>
          </div>
      {courses?
          <div className="grid-layout gird-column_two grid">
          {courses.map((course) => (
          <div key={course._id} className="added-course-wrapper flex">
            <div className="added-course">
            <p>{course.course}</p>
           </div>
          <div className="cursor-pointer" onClick={handleDelete}>
               <XMarkIcon width={25}/>
          </div>
          </div> 
          ))
         }
        </div>
        :
        <div><p>Loading...</p></div>
        }
        </div>
  </div>
     );
}
 
export default ManageCourses;