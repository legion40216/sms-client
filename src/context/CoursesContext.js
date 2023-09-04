import { createContext, useReducer } from 'react'

export const CoursesContext = createContext()

export const coursesReducer = (state, action) =>{
  switch(action.type) {
    case 'SET_COURSES' :
      return {
         courses: action.payload,
         loading: false // Set loading to false when data is available
      }
      case 'CREATE_COURSE':
       return {
            courses: [action.payload, ...state.courses],
            loading: false // Set loading to false when data is available
          }
        
      case 'DELETE_COURSE':
        return {
          courses: state.courses.filter((course)=> course._id !== action.payload._id),
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

export const CoursesContextProvider = ({ children }) =>{
  const [state, dispatch] = useReducer(coursesReducer, {
    courses: [],
    loading: false
  });

    return (
      <CoursesContext.Provider value={{...state, dispatch}}>
        {children}
      </CoursesContext.Provider>
    )
}