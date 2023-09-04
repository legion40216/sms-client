import { useState } from "react";
import StudentForm from "../com/Stundent/StudentForm";

const AddStudent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null);
    
  const [formData, setFormData] = useState({
      name:"",
      fatherName:"",
      motherName:"",
      rollNo:"",
      email:"",
      enrolledClass:""
  })

  const UpdateForm = (change) =>{
      setFormData((prevData)=>({...prevData, ...change}))
  }

     const handleStudentSubmit = async (e) =>{
      e.preventDefault()
      setIsSubmitting(true);
      setSuccess(null)
      try {
      const response = await fetch('/api/students/',{
       method: 'POST',
       body: JSON.stringify(formData),
       headers: {
         'Content-Type': 'application/json'
       }
      })
      const json = await response.json()

      if(response.ok)
      {
       setFormData({
           name:"",
           fatherName:"",
           motherName:"",
           rollNo:"",
           email:"",
           enrolledClass:""
         });
         setIsSubmitting(false);
         setError(null)
         setSuccess("New student added")
      } else {
       if (response.status === 400) {
         setError(json.error + " " + json.emptyFields);
       }
       else if (response.status === 500) {
         setError('Server error');
       } else {
         setError('An error occurred while creating entrie on server')
       }    
       setIsSubmitting(false);
      }
     }
      catch (error) {
       console.error('Error uploading student:', error);
       setError('Problem connecting to server')
       setIsSubmitting(false);
     }
    }

    return ( 
        <div className="container-sms_content container--addstudent flow">
            <div>  
                <h1 className="fw-500 uppercase" >add stundent details</h1>
            </div>
           <StudentForm 
           UpdateForm={UpdateForm} 
           handleStudentSubmit={handleStudentSubmit}
           error={error}
           isSubmitting={isSubmitting}
           success={success}
           addStudentForm={true}
           formData={formData}
           />
        </div>
     );
}
 
export default AddStudent;