import { StudentsContext } from "../context/StudentsContext";
import { useContext } from "react";

export const useStudentsContext = () =>{
    const context = useContext(StudentsContext)

    if(!context) {
        throw Error('this must be used inside workout context provider')
    }

    return context
}