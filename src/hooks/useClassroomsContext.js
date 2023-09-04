import { ClassroomsContext } from "../context/ClassroomsContext";
import { useContext } from "react";


export const useClassroomsContext = () =>{
    const context = useContext(ClassroomsContext)

    if(!context) {
        throw Error('this must be used inside workout context provider')
    }

    return context
}