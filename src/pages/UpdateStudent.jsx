import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForm from "../com/Stundent/StudentForm";

const UpdateStudent = () => {
    const {id} = useParams()
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

    useEffect(()=>{
        const fetchStudent = async () =>{
            try {
                const response = await fetch('/api/students/'+ id);
                const json = await response.json();
    
                if (response.ok) {
                  setError(null)
                  setFormData({
                    name:json.name,
                    fatherName:json.fatherName,
                    motherName:json.motherName,
                    rollNo:json.rollNo,
                    email:json.email,
                    enrolledClass:json.enrolledClass
                    })
                } else {
                  // Handle different HTTP status codes with specific error messages
                  if (response.status === 404) {
                    setError(json.error);
                  }
                  else if (response.status === 500) {
                    setError('Server error');
                  } else {
                    setError('An error occurred while fetching data from server')
                  }    
                }
              } catch (error) {
                // Handle network error or other exceptions
                console.error('Error fetching student:', error);
                setError('An error occurred while fetching data');
              }
            };
        fetchStudent()
    },[])
  
    const handleStudentUpdate = async (e) =>{
        e.preventDefault()
        setIsSubmitting(true);
        setSuccess(null)
    try {
        const response = await fetch('/api/students/'+ id,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
           })
          const json = await response.json()

          if(response.ok){
            setIsSubmitting(false);
            setError(null)
            setSuccess("Student Updated")
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
    } catch (error) {
        console.error('Error updating student:', error);
        setError('Problem connecting to server')
        setIsSubmitting(false);
    }
    }

    const handleDeleteStudnet = async () =>{

    }
    console.log(success)
    return ( 
        <div className="container-sms_content flow">
            <div>  
                <h1 className="fw-500 uppercase" >update stundent details</h1>
            </div>
          <StudentForm 
            formData={formData}
            error={error}
            isSubmitting={isSubmitting}
            success={success}
            UpdateForm={UpdateForm} 
            handleStudentUpdate = {handleStudentUpdate}
            handleDeleteStudnet = {handleDeleteStudnet}
          />
        </div>
     );
}
 
export default UpdateStudent;