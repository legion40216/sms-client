import { useEffect, useState } from "react";

const Home = () => {
   const [students, setStudents] = useState(null)
   
   useEffect(()=>{
       const fetchStudents = async () => {
         try {
           const response = await fetch('https://awake-sparkly-prose.glitch.me/api/students');
           const json = await response.json();
       
           if (!response.ok) {
             console.error('Error fetching students:', json);
             throw new Error('Failed to fetch students');
           }
           setStudents(json.length)
         } catch (error) {

           console.error('Error fetching students:', error);
           // Optionally, you can handle the error further or rethrow it
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
                ? <p>{students}</p>
                : <p className="fs-200 fw-400">Loading...</p>
                }
               </span>
            </div>
         </div>
        </div>
     );
}
 
export default Home;