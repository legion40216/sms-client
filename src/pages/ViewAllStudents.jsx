import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

const ViewAllStudents = () => {
    const [error, setError] = useState(null)
    const [students, setStudents] = useState([])
    const [filteredStudent, setFilteredStudent] = useState([]);
    
    useEffect(()=>{
        const fetchStudents = async () =>{
          try {
              const response = await fetch('/api/students');
              const json = await response.json();
  
              if (response.ok) {
                setError(null)
                setFilteredStudent(json)
                setStudents(json)
              } else {
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
              console.error('Error fetching students:', error);
              setError("Problem connecting to server")
            }
          };
        fetchStudents()
      },[])

       const handleSearchBar = (e) => {
        const  searchTerm = e.target.value
        
        const filteredStudentNames = students.filter((student) => {
          const nameMatches = student.name.toLowerCase().includes(searchTerm);
          const rollNumberMatches = student.rollNo == searchTerm;
          const classMatches = student.enrolledClass.classtitle.toLowerCase().includes(searchTerm);
          return nameMatches || rollNumberMatches || classMatches;
       });
        setFilteredStudent(filteredStudentNames)
       }

    return ( 
        <div className="flow">
            <div className="sms_table-options">
                <form action="" className="flex">
                <div>
                    <input
                      type="text" 
                      name='find'
                      autoFocus
                      placeholder='Find'
                      onInput={(e)=>{handleSearchBar(e)}}
                      />
                </div>
                </form>
            </div>
          <div>

          <div className="error_notfication">
            {
             error && !students.length > 0 && 
             <div className="error"><p>{error}</p></div>
            }
          </div>

{!error &&
<div className="container-sms_content flow">
<div>
<h2 className= "fw-500 uppercase">all students</h2>
</div>

<table className="sms_table-table">
<thead>
<tr>
    {
        ["Name", "Father's name", "Mother's name", "Roll No", "Email","Class" ].map((i,index) =>(
        <th key={index} className="text-left fw-500">{i}</th>
        ))
    }
</tr>
</thead> 
{
students ?
<tbody>
    {
  filteredStudent.map((student) => (
        <tr key={student._id}>
         <td>{student.name}</td>
         <td>{student.fatherName}</td>
         <td>{student.motherName}</td>
         <td>{student.rollNo}</td>
         <td>{student.email}</td>
         <td className="capital">{student.enrolledClass.classtitle}</td>
         <td>
          <Link to={student._id.toString()}>Edit</Link>
         </td>
        </tr> 
          ))  
    }
</tbody>
:
<tbody>
<tr><td>Loading...</td></tr>
</tbody>
}
</table> 

</div>
}
</div>
</div>
     );
}
 
export default ViewAllStudents;