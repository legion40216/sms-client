import { useEffect, useState } from "react";

const AddAttendence = () => {  
  const [error, setError] = useState(null)
  const [errorClassroom, setErrorClassroom] = useState(null)
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);

    const currentDate = new Date()
    const [date, setDate] = useState(currentDate.toLocaleDateString('en-CA'))
    const [showTable, setShowTable] = useState(false);

    const [attendanceData, setAttendanceData] = useState([]);

    const [students, setStudents] = useState([])
    const [classrooms, setClassrooms] = useState([])

    const [formData, setFormData] = useState({
      classtitleId:"",
      courses:[],
      selectedCourseId:""
  })

  const UpdateForm = (change) =>{
      setFormData((prevData)=>({...prevData, ...change}))
  }

    useEffect(()=>{
      const fetchClassrooms = async () =>{
        try {
            const response = await fetch('/api/classrooms');
            const json = await response.json();

            if (response.ok) {
              setError(null); // Clear error state on success
              setErrorClassroom(null)
              setClassrooms(json);
            } else {
              // Handle different HTTP status codes with specific error messages
              if (response.status === 404) {
                setErrorClassroom('Class not found');
              }
              else if (response.status === 500) {
                setErrorClassroom('Server error');
              } else {
                setErrorClassroom('An error occurred while fetching data from server')
              }    
            }
          } catch (error) {
            // Handle network error or other exceptions
            console.error('Error fetching courses:', error);
            setErrorClassroom('An error occurred while fetching data');
          }
        };
    fetchClassrooms()
  },[])

    const handleGenerateAttendence = async (event) =>{
      event.preventDefault()
      setError(null)
      setSuccess(null)
      setShowTable(false)
      setIsGeneratingSheet(true)
      if(formData.classtitleId === "" || formData.selectedCourseId === "")
      {
        setError("Class or subject not selected")
        setIsGeneratingSheet(false)
        return 
      }
 
      try {
        // Check if attendance records already exist for the selected date
        const response = await 
       fetch(`/api/attendances/check?date=${date}&classroom=${formData.classtitleId}&course=${formData.selectedCourseId}`);
        const existingRecords = await response.json();
        if (response.ok) {
        try {
          const response = await fetch(`/api/students/filter?enrolledClass=${formData.classtitleId}`);
          const json = await response.json();
          if (response.ok) {
            const initialAttendanceData = json.map(student => ({
              student: student._id,
              present: false,
              classroom: formData.classtitleId,
              course: formData.selectedCourseId,
              date: date, 
            }))
            setAttendanceData(initialAttendanceData)
            setStudents(json)
            setIsGeneratingSheet(false)
            setShowTable(true)
          } else {
            // Handle different HTTP status codes with specific error messages
            if (response.status === 404) {
              setError('No students found for this classroom');
            }
            else if (response.status === 500) {
            setError('Server error');
            } else {
            setError('An error occurred while fetching data from server')
            } 
            setIsGeneratingSheet(false) 
          }
        } catch (error) {
          // Handle network error or other exceptions
          console.error('Error fetching student filter:', error);
          setError('An error occurred while fetching data');
        }
        
      } else {
        if (response.status === 404) {
          setError(existingRecords.error)
        }
        else if (response.status === 500) {
          setErrorClassroom('Server error');
        } else {
          setErrorClassroom('An error occurred while fetching data from server')
        }    
        setIsGeneratingSheet(false)
      }

      } catch (error) {
      console.error('Error generating attendance sheet:', error);
      setIsGeneratingSheet(false)
    }
    }

    const handleAttendenceSumbit = async (e) => {
      e.preventDefault()
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/attendances/mark',{
          method: 'POST',
          body: JSON.stringify(attendanceData),
          headers: {
            'Content-Type': 'application/json'
          }
         })
        const json = await response.json()
        if(response.ok)
        {
         setIsSubmitting(false)
         setShowTable(false)
         setSuccess("Attendence Successfully Submited")
        } else {
          if (response.status === 500) {
            setError(json.error);
          } else {
            setError('An error occurred while creating entrie on server')
          }  
        }
        setIsSubmitting(false)
      } catch (error) {
        console.error('Error uploading Attendecne data to attendance:', error);
        setError("Problem connecting to server")
        setIsSubmitting(false);
      }
}

const handleCheckboxChange = (studentId, isChecked) => {
  setAttendanceData(prevData => 
    prevData.map(item => 
      item.student === studentId ? { ...item, present: isChecked } : item
    )
  );
};

const handleClassroomSelect = (e) =>{
  UpdateForm({classtitleId:e.target.value, courses:""})
if(e.target.value)
{
  const selectedClass = classrooms.find((classtitle) => (
    classtitle._id === e.target.value
    ));
    UpdateForm({courses:selectedClass.courses})
}
}

    return ( 
        <div className="flow">
            <div className="sms_table-options">
            <form action="" className="flex">
                <div>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
                </div>

              <div className="flex align-end">
                <select id= "classtitle" 
                name='classtitle' 
                value={formData.classtitleId} 
                className={`${errorClassroom ? "error_border" : ""}`}
                onChange={(e)=>{handleClassroomSelect(e)}} >
                    <option value="" className="text-none">Select class</option>
                    {
                    classrooms && classrooms.map((classroom)=>(
                        <option key={classroom._id} 
                        value={classroom._id}>
                          {classroom.classtitle}
                        </option>
                      ))
                    }
                </select>
                {errorClassroom &&  <div className="error"><p>{errorClassroom}</p></div>}
                </div>

                <div>
                 <select
                    value={formData.selectedCourseId}
                    onChange={(e)=>{UpdateForm({selectedCourseId:e.target.value})}} >
                    <option value={""}>select course</option>
                      {
                         formData.courses.length > 0 && 
                          formData.courses.map((course)=>(
                          <option key={course._id} 
                          value={course._id}>
                            {course.courseName}
                          </option>
                        ))
                      }
                    </select>  
                </div>
             <button 
             type="submit" 
             onClick={handleGenerateAttendence}
             data-type={`${isGeneratingSheet ? "primary-disable" :"primary"}`} 
             disabled={isGeneratingSheet}>
             {isGeneratingSheet ? 'Generating...' : 'Generate'}
             </button>
        </form>
      </div>

<div className="flow">
{showTable &&          
<div className="container-sms_content flow">
<div>
<h2 className="fw-500 uppercase">create attendence sheet</h2>
</div>
<table className="sms_table-table">
<thead>
<tr>
    {
        ["Name", "Roll No", "Class", "Present" ].map((i,index) =>(
        <th key={index} 
        className={`fw-500 ${i === "Present" ? "text-center" :"text-left"}`}>{i}</th>
        ))
    }
</tr>
</thead> 
{students ?
<tbody>
    {
    students.map((student, index) => (
        <tr key={student._id}>
         <td>{student.name}</td>
         <td>{student.rollNo}</td>
         <td>{student.enrolledClass.classtitle}</td>
         <td className="text-center">
            <input type="checkbox" 
            checked={attendanceData[index].present || false}
            onChange={(e)=>{handleCheckboxChange(student._id,e.target.checked)}}
            />
         </td>
        </tr> 
          ))
    }
</tbody>
: <tbody><tr><td>Loading...</td></tr></tbody>
  }
</table> 
<div>
        <button
        data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
        disabled={isSubmitting} onClick={(e)=>{handleAttendenceSumbit(e)}}>
        {isSubmitting ? 'Submiting...' : 'Submit'}
        </button>
</div>
</div>
}
{error &&  <div className="error"> <p>{error}</p></div>}
{success &&  <div className="success"> <p>{success}</p> </div>}
</div>
</div>
     );
}
 
export default AddAttendence;