import { useEffect, useState } from "react";
import { useClassroomsContext } from "../hooks/useClassroomsContext";

import ClassManagementForm from "../com/Classes/ClassManagementForm";
import ClassManagementUpdate from "../com/Classes/ClassManagementUpdate";
import ClassManagementList from "../com/Classes/ClassManagementList";

const ClassManagement = () => {
    const [errorClassroom, setErrorClassroom] = useState(null)
    const [toggleForm, setToggleForm] = useState(false)
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);

    const {classrooms, loading, dispatchClassrooms} = useClassroomsContext()
 
    useEffect(()=>{
               const fetchclassrooms = async () =>{
                dispatchClassrooms({ type: 'SET_LOADING' });
            try {
                const response = await fetch('/api/classrooms');
                const json = await response.json();
    
                if (response.ok) {
                  setErrorClassroom(null); // Clear error state on success
                  dispatchClassrooms({type: 'SET_CLASSROOMS', payload: json})
                } else {
                  // Handle different HTTP status codes with specific error messages
                  if (response.status === 404) {
                    setErrorClassroom(json.error);
                  } else if (response.status === 500) {
                    setErrorClassroom('Server error');
                  } else {
                    setErrorClassroom('An error occurred while fetching data from server')
                  }  
                }
              } catch (error) {
                // Handle network error or other exceptions
                console.error('Error fetching classes:', error);
                setErrorClassroom("Problem connecting to server")
              }
            };
        fetchclassrooms()
      },[dispatchClassrooms])

  const handleCloseBackdrop = (id) =>{
    setToggleForm(!toggleForm)
    setSelectedClassroomId(id)
  }

    return ( 
        <div className="container--classmanagement"> 
           <div className="flow">
            <div className="sms_table-options" >
             <ClassManagementForm/>
            </div>
            <div className="error_notfication">
            {
             errorClassroom && !classrooms.length > 0 && 
             <div className="error"><p>{errorClassroom}</p></div>
            }
            </div>
            {  
            !errorClassroom &&
            loading ? (
              <div>Loading...</div>
              ) : (
             classrooms.map((classroom) => (
                  <div className="container-sms_content flow" key={classroom._id}>
                      <ClassManagementList classroom={classroom} />
                      <button data-type="primary" onClick={() => handleCloseBackdrop(classroom._id)}>
                          Edit
                      </button>
            <div className={`update_classes__backdrop 
            ${toggleForm && selectedClassroomId === classroom._id ? "flex" : "dnone"}`} 
            onClick={()=>{handleCloseBackdrop(null)}}>
              <ClassManagementUpdate classroom={classroom} />
            </div>    
            </div>
              ))
             )
           }
          </div>
        </div>
     );
}
export default ClassManagement;