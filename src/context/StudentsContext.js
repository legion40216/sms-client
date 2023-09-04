import { createContext, useReducer } from 'react'

export const StudentsContext = createContext()

export const studentsReducer = (state, action) =>{
  switch(action.type) {
    case 'SET_STUDENTS' :
      return {
         students: action.payload,
         loading: false // Set loading to false when data is available
      }
      case 'CREATE_STUDENT':
       return {
            students: [action.payload, ...state.courses],
            loading: false // Set loading to false when data is available
          }
        
      case 'DELETE_STUDENT':
        return {
          students: state.students.filter((student)=> student._id !== action.payload._id),
          loading: false // Set loading to false when data is available
        }

        case 'SET_LOADING':
          return {
              ...state,
              loading: true // Set loading to true when loading starts
          };
          
        default :
        return state
  }
}

export const StudentsContextProvider = ({ children }) =>{
  const [state, dispatchStudents] = useReducer(studentsReducer, {
    students: [],
    loading: false
  });

    return (
      <StudentsContext.Provider value={{...state, dispatchStudents}}>
        {children}
      </StudentsContext.Provider>
    )
}