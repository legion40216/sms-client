import { useEffect, useRef, useState } from "react";

const AddStudent = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [classTitle, setClassTitleData] = useState(null)
    
    const [formData, setFormData] = useState({
        name:"",
        fname:"",
        mname:"",
        rollno:"",
        email:"",
        classtitle:""
    })

    const [error, setError] = useState(null)
    
    const UpdateForm = (change) =>{
        setFormData((prevData)=>({...prevData, ...change}))
    }

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

    const formRef = useRef()

     const handleSubmit = async (e) =>{
       e.preventDefault()
       setIsSubmitting(true);

       const response = await fetch('https://awake-sparkly-prose.glitch.me/api/students',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
       })
       const json = await response.json()

       if(!response.ok)
       {
        setError(json.error)
        setIsSubmitting(false);
       }
       if(response.ok)
       {
        setError(null)
        console.log("new workout added" , json)
        setFormData({
            name:"",
            fname:"",
            mname:"",
            rollno:"",
            email:"",
            classtitle:""
          });

          formRef.current.reset()
          setIsSubmitting(false);
       }
     }

    return ( 
        <div className="container-sms_content container--addstudent flow">
            <div>  
                <h1 className="fw-500 uppercase" >add stundent details</h1>
            </div>
            <form action="" onSubmit={handleSubmit} ref={formRef} className="flow">
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
                    <label htmlFor="fname">Father's Name</label>
                    <input
                      type="text" 
                      id= "fname"
                      name='fname'
                      autoFocus
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({fname:e.target.value})}} 
                      value={formData.fname}/>
                </div>
                <div>
                    <label htmlFor="mname">Mother's Name</label>
                    <input
                      type="text" 
                      id= "mname"
                      name='mname'
                      autoFocus
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({mname:e.target.value})}} 
                      value={formData.mname}/>
                </div>
                <div>
                    <label htmlFor="rollno">Roll No</label>
                    <input
                      type="number" 
                      id= "rollno"
                      name='rollno'
                      autoFocus
                      placeholder='e.g. Stephen King'
                      required
                      onChange={(e)=>{UpdateForm({rollno:e.target.value})}} 
                      value={formData.rollno}/>
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
                <select id= "classtitle" 
                name='classtitle' 
                value={formData.classtitle} 
                onChange={(e)=>{UpdateForm({classtitle:e.target.value})}} >
                    <option value="" className="text-none">Select a class</option>
                    {
                     classTitle && classTitle.map((classes)=>(
                        <option key={classes._id} 
                        value={classes._id}>
                          {classes.classtitle}
                        </option>
                      ))
                    }
                </select>
                </div>
            </div>
            <div className="flex justify-sb">
                <button type="submit" 
                data-type={`${isSubmitting ? "primary-disable" :"primary"}`} 
                disabled={isSubmitting}>
                {isSubmitting ? 'Adding Student...' : 'Add student'}
                </button>
                {error &&  <div className="error"> <p>{error}</p></div>}
            </div>   
            
            </form>
        </div>
     );
}
 
export default AddStudent;