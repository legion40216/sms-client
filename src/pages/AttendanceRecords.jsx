import { useEffect, useState } from "react";

const AttendanceRecords = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setloading] = useState(false)

    const [classrooms, setClassrooms] = useState(null);
    const [courses, setCourses] = useState(null);
    const [attendances, setAttendances] = useState(null)
    const [filteredAttendance, setFilteredAttendance] = useState(null);
        
    const [error, setError] = useState(null)
    const [errorClassroom ,setErrorClassroom] = useState(null)
    const [errorCourses ,setErrorCourses] = useState(null)

    const [formData, setFormData] = useState({
        searchCriteria:"",
        startDate:"",
        endDate:"",
        selectClasstitleId:"",
        selectCourseId:"",
        courses:[],
        searchText:"",
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
            console.error('Error fetching classrooms:', error);
            setErrorClassroom('An error occurred while fetching data');
          }
        };

        const fetchcourses = async () =>{
          try {
              const response = await fetch('/api/courses');
              const json = await response.json();

              if (response.ok) {
                setErrorCourses(null); // Clear error state on success
                setCourses(json)
              } else {
                // Handle different HTTP status codes with specific error messages
                if (response.status === 404) {
                  setErrorCourses(json.error);
                } else if (response.status === 500) {
                  setErrorCourses('Server error');
                } else {
                  setErrorCourses('An error occurred while fetching data from server')
                }  
              }
            } catch (error) {
              // Handle network error or other exceptions
              console.error('Error fetching courses:', error);
              setErrorCourses("Problem connecting to server")
            }
          };
  
    fetchcourses()
    fetchClassrooms()
    },[])

    const handleClassroomSelect = (e) =>{
      UpdateForm({selectClasstitleId:e.target.value, courses:""})
      if(e.target.value)
      {
        const selectedClass = classrooms.find((classtitle) => (
          classtitle._id === e.target.value
          ));
          UpdateForm({courses:selectedClass.courses})
      }
    }

    const handleFindAttendence = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setloading(true);
    
      if (
        formData.selectClasstitleId === "" &&
        formData.selectCourseId === "" &&
        formData.startDate === "" &&
        formData.endDate === "" &&
        formData.searchText === ""
      ) {
        setError("Select at least one option");
        setIsSubmitting(false);
        return;
      }
    
      try {
        const response = await fetch(
          `/api/attendances?searchText=${formData.searchText}startDate=${formData.startDate}&endDate=${formData.endDate}&course=${formData.selectCourseId}&classroom=${formData.selectClasstitleId}`
        );
        const foundRecords = await response.json();
    
        if (response.ok) {
          setError(null);
          // Format the date in each record before setting it in state
          const formattedRecords = foundRecords.map((attendanceData) => ({
            ...attendanceData,
            date: formatDate(attendanceData.date),
          }));
          setAttendances(formattedRecords);
          setFilteredAttendance(formattedRecords)
        } else {
          if (response.status === 404) {
            setError(foundRecords.error);
          } else if (response.status === 500) {
            setError("Server error");
          } else {
            setError("An error occurred while fetching data from the server");
          }
        }
        setloading(false);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error generating attendance record:", error);
        setError("An error occurred while fetching data");
        setIsSubmitting(false);
        setloading(false);
      }
    };
    
    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    }
    
    const handleSearchBar = (e) => {
      const  searchTerm = e.target.value
      
      const filteredAttendanceNames = attendances.filter((attendance) => {
        const nameMatches = attendance.student.name.toLowerCase().includes(searchTerm);
        return nameMatches;
     });
      setFilteredAttendance(filteredAttendanceNames)
      UpdateForm({searchCriteria:e.target.value})
     }

 return ( 
<div className="flow">
    <div className="sms_table-options">
    <form action="" onSubmit={(e)=>{handleFindAttendence(e)}} className="flow">
      <div>
        <label htmlFor="searchCriteria">Search Criteria</label>
        <input 
        type="text" 
        name="searchCriteria" 
        id="searchCriteria" 
        onChange={(e)=>{handleSearchBar(e)}} 
        value={formData.searchCriteria}
        />
     </div>
      <div className="flex align-end flex-wrap">
       <div> 
            <label htmlFor="searchText">Search Text</label>
            <input 
            type="text" 
            name="searchText" 
            id="searchText" 
            onChange={(e)=>{UpdateForm({searchText:e.target.value})}} 
            value={formData.searchText}
            />
        </div>
       <div> 
           <label htmlFor="startDate">Start Date</label>
            <input type="date" 
            name="startDate" 
            id="startDate" 
           onChange={(e)=>{UpdateForm({startDate:e.target.value})}} 
            value={formData.startDate} 
            />
        </div>
          <div>
            <label htmlFor="endDate">End Date</label>
            <input type="date"
             name="endDate" 
             id="endDate" 
             onChange={(e)=>{UpdateForm({endDate:e.target.value})}} 
             value={formData.endDate}
             />
          </div>

        <div className="flex align-end">
          <select 
            id= "classtitle" 
            name='classtitle' 
            value={formData.selectClasstitleId} 
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

            <div className="flex align-center">
              <select
                  value={formData.selectCourseId}
                  onChange={(e)=>{UpdateForm({selectCourseId:e.target.value})}} 
                  className={`${errorCourses ? "error_border" : ""}`}
                  >
                  <option value={""}>select course</option>
                { formData.selectClasstitleId === "" ? 
                (
                  courses && 
                  courses.map((course)=>(
                  <option key={course._id} 
                  value={course._id}>
                  {course.courseName}
                  </option>
                  ))
                )
                : (
                 formData.courses && 
                 formData.courses.map((course)=>(
                 <option key={course._id} 
                 value={course._id}>
                 {course.courseName}
                 </option>
                 ))
                 )
                }
              </select>
              {errorCourses &&  <div className="error"><p>{errorCourses}</p></div>}
        </div>
    </div> 
          <button 
             type="submit" 
             data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
             disabled={isSubmitting}>
             {isSubmitting ? 'Finding...' : 'find'}
          </button>
        </form>
    </div>

{attendances && !error &&
<div className="container-sms_content flow">
<div>
<h2 className="fw-500 uppercase">Attendence Records</h2>
</div>
<table className="sms_table-table">
<thead>
<tr>
    {
        ["Name", "Course", "Class", "Date", "Present" ].map((i,index) =>(
        <th key={index} 
        className={`fw-500 ${i === "Present" ? "text-center" :"text-left"}`}>{i}</th>
        ))
    }
</tr>
</thead> 
{
  loading ?
  <tbody><tr><td>Loading...</td></tr></tbody>
  :         
<tbody>
    {
     filteredAttendance.map((attendance)=>(
      <tr key={attendance._id}>
      <td>{attendance.student.name}</td>
      <td>{attendance.course.courseName}</td>
      <td>{attendance.classroom.classtitle}</td>
      <td>{attendance.date}</td>
      <td className="text-center">
        <input type="checkbox"
         readOnly 
         checked={attendance.present} />
        </td>
     </tr> 
     ))
    }
</tbody>
}
</table> 
</div>
}
{error &&  <div className="error"> <p>{error}</p></div>}
</div>
     );
}
 
export default AttendanceRecords;