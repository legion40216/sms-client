import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"

//pages
import Home from "./pages/Home";
import AddStudent from "./pages/AddStudent";
import ShowAllStudents from "./pages/ShowAllStudents";
import AddAttendence from "./pages/AddAttendence";
import Attendence from "./pages/Attendence";
import ManageCourses from "./pages/ManageCourses";
import AddTeacher from "./pages/AddTeacher";
import ManageClasses from "./pages/ManageClasses";

//layouts
import RootLayout from "./layouts/RootLayout";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<RootLayout/>}>
        <Route index element={<Home />} />
        <Route path= "addstudent" element={<AddStudent />} />
        <Route path= "showallstudents" element={<ShowAllStudents />} />
        <Route path= "addattendence" element={<AddAttendence />} />
        <Route path= "attendence" element={<Attendence />} />
        <Route path= "addteacher" element={<AddTeacher />} />
        <Route path= "managecourses" element={<ManageCourses />} />
        <Route path= "manageclasses" element={<ManageClasses />} />
       
    </Route>
    </>
))

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;