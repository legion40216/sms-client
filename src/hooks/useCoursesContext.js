import { CoursesContext } from "../context/CoursesContext";
import { useContext } from "react";


export const useCoursesContext = () =>{
    const context = useContext(CoursesContext)

    if(!context) {
        throw Error('this must be used inside workout context provider')
    }

    return context
}