import { useEffect, useState } from "react";

const Home = () => {
   const [students, setStudents] = useState(null)
   const [error, setError] = useState(null)
   
   useEffect(()=>{
       const fetchStudents = async () => {
        try {
          const response = await fetch(`/api/students`);
          const data = await response.json();
        
          if (response.ok) {
            setError(null); // Clear error state on success
            setStudents(data);
          } else {
            // Handle different HTTP status codes with specific error messages
            if (response.status === 404) {
              setError('No students found');
            }
            else if (response.status === 500) {
              console.error('Server error');
            } else {
              console.error('An error occurred while fetching data from server')
            }  
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
       };
       fetchStudents()
    },[])


    return ( 
        <div className="container-home">
         <div className="pill-info flow">
            <h2 className="fs-100 fw-500 letter-spacing-1 uppercase text-center ">total students</h2>
            <div>
               <span className="fw-600 fs-400">
                {students
                ? <p>{students.length}</p>
                : <p className="fs-200 fw-400">{error ? error : "Loading..."}</p>
                }
               </span>
            </div>
         </div>
        </div>
     );
}
 
export default Home;