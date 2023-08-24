import { useEffect, useState } from "react";


const AddAttendence = () => {  
    const currentDate = new Date()
    const [date, setDate] = useState(currentDate.toLocaleDateString('en-CA'))
    const [students, setStudents] = useState(null)
    const [attendanceData, setAttendanceData] = useState([]);
    const [classTitle, setClassTitleData] = useState(null)
    const [classValue, setClassValue] = useState("")
    const [classSubjects, setClassSubjects] = useState("")
    const [courseId, setCourseId] = useState("")
    
    const [error, setError] = useState(false)
    const [successfulSubmit, setSuccessfulSubmit] = useState(false);
    const [showTable, setShowTable] = useState(false);
    
    const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    useEffect(()=>{
      const fetchclasstitle = async () =>{
        try {
            const response = await fetch('https://awake-sparkly-prose.glitch.me/api/classrooms');
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
    fetchclasstitle()
  },[])

    const handleGenerateAttendence = async (event) =>{
      event.preventDefault()
      setError(false)
      if(classValue === ""|| courseId === "" )
      {
        setError("Class or subject not selected")
        return 
      }

      try {
        setIsGeneratingSheet(true)
        setSuccessfulSubmit(false)
        // Check if attendance records already exist for the selected date
        const response = await 
        fetch(`https://awake-sparkly-prose.glitch.me/api/attendances/check?date=${date}&classtitle=${classSubjects._id}&courseId=${courseId}`);
        const existingRecords = await response.json();

        if (!response.ok) {
          // Handle specific error cases based on the HTTP response status
          console.error('Error fetching students:', existingRecords);
          // Optionally, you can throw an error to be caught by the calling code
          throw new Error('Failed to fetch students');
        }
 
        if (existingRecords) {

          setError("Attendence Already Exist On This date")
          setShowTable(false)
          setIsGeneratingSheet(false)
          return;
        }
        setShowTable(true)
        try {

            const response = await fetch(`https://awake-sparkly-prose.glitch.me/api/students/filter?classtitle=${classSubjects._id}`);
            const json = await response.json();

            if (!response.ok) {
              // Handle specific error cases based on the HTTP response status
              if (response.status === 404) {
                setError('No students found for this class title');
                setIsGeneratingSheet(false)
                setShowTable(false)
              } 
              console.error('Error fetching students:', json);
              // Optionally, you can throw an error to be caught by the calling code
              throw new Error('Failed to fetch students');
            }
              const initialAttendanceData = json.map(student => ({
                student: student._id,
                present: false,
                classtitle: classSubjects._id,
                course: courseId,
                date: date, 
              }))
              setAttendanceData(initialAttendanceData)
              setStudents(json)
              setIsGeneratingSheet(false)
  

          } catch (error) {
          console.error('Error fetching students:', error);
          setIsGeneratingSheet(false)
          }
      }
      catch (error) {
      console.error('Error generating attendance sheet:', error);
      setIsGeneratingSheet(false)
    }
    }

      const handleCheckboxChange = (studentId, isChecked) => {
        // Update the attendance status of the student with the given ID in the state
        // console.log(id)
        // setStudents((prevStudents) =>
        // prevStudents.map((student) =>
        //   student.student === id
        //     ? { ...student, present: !student.present }
        //     : student ));
        setAttendanceData(prevData => 
          prevData.map(item => 
            item.student === studentId ? { ...item, present: isChecked } : item
          )
        );
      };

      const handleCourseSelect = (e) =>{
        setShowTable(false)
        setCourseId("")
        setAttendanceData([])
        setStudents(null)
        setClassValue(e.target.value)

        const selectedClass = classTitle.find((classname) => (
          classname.classtitle === e.target.value
          ));

        setClassSubjects(selectedClass)
      }

    const handleSumbit = async () => {
      setIsSubmitting(true);
      const response = await fetch('https://awake-sparkly-prose.glitch.me/api/attendances',{
       method: 'POST',
       body: JSON.stringify(attendanceData),
       headers: {
         'Content-Type': 'application/json'
       }
      })
      const json = await response.json()
      if(!response.ok)
      {
        console.log("error" , json.error)
        setIsSubmitting(false)
      }
      if(response.ok)
      {
       console.log("new attendence added" , json)
       setIsSubmitting(false)
       setShowTable(false)
       setSuccessfulSubmit(true)
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
                <div>
                <select  
                value={classValue}
                onChange={(e)=>{handleCourseSelect(e)}} >
                    <option value="" className="text-none">Select a class</option>
                    {
                     classTitle && classTitle.map((classes)=>(
                        <option key={classes._id} 
                        value={classes.classtitle}>
                          {classes.classtitle}
                        </option>
                      ))
                    }
                </select>
                </div>
                <div>
                  {
                    classSubjects && 
                    <select
                    value={courseId}
                    onChange={(e)=>{setCourseId(e.target.value)}} >
                    <option value={""}>select course</option>
                      {
                        classSubjects.courseids.map((courses)=>(
                          <option key={courses._id} value={courses._id}>{courses.course}</option>
                        ))
                      }
                    </select>  
                  }
                </div>
             <button 
             type="submit" 
             onClick={(e)=>{handleGenerateAttendence(e)}}
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
         <td>{student.rollno}</td>
         <td>{student.classtitle.classtitle}</td>
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
        disabled={isSubmitting} onClick={handleSumbit}>
        {isSubmitting ? 'Submiting...' : 'Submit'}
        </button>
</div>
</div>
}
{error &&  <div className="error"> <p>{error}</p></div>}
{successfulSubmit &&  <div className="success"> <p>Attendence Successfully Submited</p> </div>}
</div>
</div>
     );
}
 
export default AddAttendence;