import { createContext, useReducer } from 'react'

export const ClassroomsContext = createContext()

export const classroomsReducer = (state, action) =>{
  switch(action.type) {
    case 'SET_CLASSROOMS':
      return {
          classrooms: action.payload,
          loading: false // Set loading to false when data is available
      };
  case 'CREATE_CLASSROOM':
      return {
          classrooms: [action.payload, ...state.classrooms],
          loading: false // Set loading to false after creating a classroom
      };
  case 'DELETE_CLASSROOM':
      return {
          classrooms: state.classrooms.filter((classroom) => classroom._id !== action.payload._id),
          loading: false // Set loading to false after deleting a classroom
      };
  case 'UPDATE_CLASSROOM':
        return {
          ...state,
          classrooms: state.classrooms.map(classroom => {
            if (classroom._id === action.payload._id) {
              return action.payload; // Use the updated classroom from the payload
            } else {
              return classroom;
            }
          }),
            loading: false // Set loading to false after deleting a classroom
      };
  case 'SET_LOADING':
      return {
          ...state,
          loading: true // Set loading to true when loading starts
      };
  default:
      return state;
}
}

export const ClassroomsContextProvider = ({ children }) =>{
  const [state, dispatchClassrooms] = useReducer(classroomsReducer, {
    classrooms: [],
    loading: false
  });

    return (
      <ClassroomsContext.Provider value={{...state, dispatchClassrooms}}>
        {children}
      </ClassroomsContext.Provider>
    )
}