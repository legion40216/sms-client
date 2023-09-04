import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"

//pages
import Home from "./pages/Home";
import AddStudent from "./pages/AddStudent";
import ViewAllStudents from "./pages/ViewAllStudents";
import AddAttendence from "./pages/AddAttendence";
import AttendanceRecords from "./pages/AttendanceRecords";
import CourseManagement from "./pages/CourseManagement";
import ClassManagement from "./pages/ClassManagement";
import AddTeacher from "./pages/AddTeacher";
import UpdateStudent from "./pages/UpdateStudent";

//layouts
import RootLayout from "./layouts/RootLayout";




const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<RootLayout/>}>
        <Route index element={<Home />} />
        <Route path= "addstudent" element={<AddStudent />} />
        <Route path= "viewallstudents">
          <Route index element={<ViewAllStudents />}/>
          <Route 
           path=":id" 
           element={<UpdateStudent/>} 
           />
        </Route>
        <Route path= "addattendence" element={<AddAttendence />} />
        <Route path= "attendancerecords" element={<AttendanceRecords/>} />
        <Route path= "addteacher" element={<AddTeacher />} />
        <Route path= "coursemanagement" element={<CourseManagement />} />
        <Route path= "classmanagement" element={<ClassManagement />} />
    </Route>
    </>
))

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;