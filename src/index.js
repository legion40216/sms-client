import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CoursesContextProvider } from './context/CoursesContext';
import { ClassroomsContextProvider } from './context/ClassroomsContext';
import { StudentsContextProvider } from './context/StudentsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <StudentsContextProvider>
    <ClassroomsContextProvider>
    <CoursesContextProvider>
    <App />
    </CoursesContextProvider>
    </ClassroomsContextProvider>
    </StudentsContextProvider>

  </React.StrictMode>
);

