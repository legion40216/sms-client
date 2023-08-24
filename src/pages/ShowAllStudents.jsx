import { useEffect, useState } from "react";


const ShowAllStudents = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [students, setStudents] = useState(null)
    
    useEffect(()=>{
        const fetchStudents = async () =>{
          try {
              const response = await fetch('https://awake-sparkly-prose.glitch.me/api/students');
              const json = await response.json();
  
              if (response.ok) {
                setStudents(json)
              } else {
                // Handle error if needed
                console.log('Error fetching students:', json);
              }
            } catch (error) {
              // Handle network error or other exceptions
              console.error('Error fetching students:', error);
            }
          };
        fetchStudents()
      },[])
  console.log(students)
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
                      required
                      />
                </div>
                <button type="submit" 
                data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
                disabled={isSubmitting}>
                {isSubmitting ? 'Searching...' : 'Search'}
                </button>
                </form>
            </div>
          <div>

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
    students.map((student) => (
        <tr key={student._id}>
         <td>{student.name}</td>
         <td>{student.fname}</td>
         <td>{student.mname}</td>
         <td>{student.rollno}</td>
         <td>{student.email}</td>
         <td  className="capital">{student.classtitle.classtitle}</td>
         <td>
            <button data-type="warning">delete</button>
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
</div>
</div>
     );
}
 
export default ShowAllStudents;