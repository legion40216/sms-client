import { useEffect, useState } from "react";
const StudentForm = ({
  UpdateForm, 
  addStudentForm = false, 
  handleStudentSubmit,
  handleDeleteStudnet,
  handleStudentUpdate,
  error,
  isSubmitting,
  success,
  formData
}) => {
    const [errorClassroom, setErrorClassroom] = useState(null)

    const [classrooms, setClassrooms] = useState([])
  
    useEffect(()=>{
        const fetchClassrooms = async () =>{
          try {
              const response = await fetch('/api/classrooms');
              const json = await response.json();
  
              if (response.ok) {
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

    return ( 
        <form 
        onSubmit={(e)=>{addStudentForm ? handleStudentSubmit(e) : handleStudentUpdate(e)}} 
        className="flow">
            <div className="gird-column_two grid">
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text" 
                      id= "name"
                      name='name'
                      autoFocus
                      autoComplete='name'
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({name:e.target.value})}} 
                      value={formData.name}
                      />
                </div>
                <div>
                    <label htmlFor="fatherName">Father's Name</label>
                    <input
                      type="text" 
                      id= "fatherName"
                      name='fatherName'
                      autoFocus
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({fatherName:e.target.value})}} 
                      value={formData.fatherName}/>
                </div>
                <div>
                    <label htmlFor="motherName">Mother's Name</label>
                    <input
                      type="text" 
                      id= "motherName"
                      name='motherName'
                      autoFocus
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({motherName:e.target.value})}} 
                      value={formData.motherName}/>
                </div>
                <div>
                    <label htmlFor="rollNo">Roll No</label>
                    <input
                      type="number" 
                      id= "rollNo"
                      name='rollNo'
                      autoFocus
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({rollNo:e.target.value})}} 
                      value={formData.rollNo}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email" 
                      id= "email"
                      name='email'
                      autoFocus
                      autoComplete='email'
                      placeholder='@gmail'
                      required
                      onChange={(e)=>{UpdateForm({email:e.target.value})}} 
                      value={formData.email}/>
                </div>
                <div className="flex align-end">
                <select id= "enrolledClass" 
                name='enrolledClass' 
                value={formData.enrolledClass} 
                className={`${error ? "error_border" : ""}`}
                onChange={(e)=>{UpdateForm({enrolledClass:e.target.value})}} >
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
                {errorClassroom &&  <div className="error"> <p>{errorClassroom}</p></div>}
                </div>
            </div>
            <div className="flex justify-sb">
            <div className="flex">
                <button type="submit" 
                data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
                disabled={isSubmitting}>
                {isSubmitting ? 
                `${addStudentForm ? "Adding Student..." : "Updating studnet"}` 
                : `${addStudentForm ? "Add student" : "Update student"}`
                }
                </button>

              {!addStudentForm && 
                <button
                type="button"
                onClick={handleDeleteStudnet}
                data-type={"warning"} 
                >
                Delete
                </button>}
                </div>   

                {success && 
                <div className="success"> 
                <p>{success}</p> 
                </div>}
                {error &&  <div className="error"> <p>{error}</p></div>}
                </div>
          
            </form>
        
     );
}
 
export default StudentForm;