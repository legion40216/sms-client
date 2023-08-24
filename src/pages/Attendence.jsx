import { useEffect, useState } from "react";

const Attendence = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [classtitles, setClasstitles] = useState(null);
    const [classCourses, setClassCourses] = useState(null)
    const [classtitleId, setClasstitleId] = useState("")
    const [tableData, setTableData] = useState(null)
        
    const [error, setError] = useState(false)

    const [formData, setFormData] = useState({
        searchCriteria:"",
        searchText:"",
        startDate:"",
        endDate:"",
        selectClass:"",
        selectCourse:""
    })

    const UpdateForm = (change) =>{
        setFormData((prevData)=>({...prevData, ...change}))
    }
    

    useEffect(()=>{
        const fetchclasstitle = async () =>{
          try {
              const response = await fetch('https://awake-sparkly-prose.glitch.me/api/classrooms');
              const json = await response.json();
  
              if (response.ok) {
                setClasstitles(json)
              } 
              else {
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

    const handleClasstitle = (e) =>{
        const selectedClasstitle = e.target.value  

        UpdateForm({selectCourse:""})
        UpdateForm({selectClass: selectedClasstitle })
    
        const selectedClass = classtitles.find((classtitle) => (
            classtitle.classtitle === selectedClasstitle
            ));
        
        setClasstitleId(selectedClass._id)
        setClassCourses(selectedClass.courseids)
        console.log(selectedClass._id)
    }

    const handleFindAttendence = async (e) => {
        e.preventDefault()
        setIsSubmitting(true);
     try {
         const response = await 
         fetch(`https://awake-sparkly-prose.glitch.me/api/attendances?startDate=${formData.startDate}&endDate=${formData.endDate}&courseId=${formData.selectCourse}&classtitleId=${classtitleId}`);
         const foundRecords = await response.json();
        
         if (!response.ok) {
            // Handle specific error cases based on the HTTP response status
            if (response.status === 404) {
              setError('');
            } 
            setIsSubmitting(false);
            console.error('Error fetching students:', foundRecords);
            // Optionally, you can throw an error to be caught by the calling code
            throw new Error('Failed to fetch students');
          }
         console.log(foundRecords)
         setIsSubmitting(false);
         setTableData(foundRecords)
    }
    catch (error) {
        console.error('Error generating attendance sheet:', error);
        setIsSubmitting(false);
      }
    }
 console.log(tableData)

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
        onChange={(e)=>{UpdateForm({searchCriteria:e.target.value})}} 
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
            <div>
            <select name="selectClass"
               onChange={(e)=>{handleClasstitle(e)}} 
               value={formData.selectClass}>
                <option value="" className="text-none">Select class</option>
                { classtitles && classtitles.map((classtitle)=>(
                  <option key={classtitle._id} 
                     value={classtitle.classtitle}>
                    {classtitle.classtitle}
                  </option>
                ))
                }
            </select>
            </div>
            <div>
            <select name="selectCourse" 
               onChange={(e)=>{UpdateForm({selectCourse:e.target.value})}} 
               value={formData.selectCourse}>
                <option value="">Select course</option>
                {
                 classCourses && classCourses.map((classCourse)=>(
                 <option key={classCourse._id} value={classCourse._id}>{classCourse.course}</option> 
                ))
                }
            </select>
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
<div className="container-sms_content flow">
<div>
<h2 className="fw-500 uppercase">Create Attendence Sheet</h2>
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

<tbody>
    {
     tableData && tableData.map((attendanceData)=>(
      <tr key={attendanceData._id}>
      <td>{attendanceData.student.name}</td>
      <td>{attendanceData.course.course}</td>
      <td>{attendanceData.classtitle.classtitle}</td>
      <td>{`${formData.startDate}-${formData.endDate}`}</td>
      <td><input type="checkbox" name="" id="" checked={attendanceData.present} /></td>
     </tr> 
     ))
    }
</tbody>
</table> 
<div>
 
</div>
</div>
</div>
     );
}
 
export default Attendence;