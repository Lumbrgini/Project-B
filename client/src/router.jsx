import { createBrowserRouter } from "react-router-dom";
import { App } from './App.jsx';
import { Home } from './pages/Home.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { People } from './pages/People.jsx';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NotFound />,
        children: [
            {path: "/", element: <Home/>},
            {path: "/home", element: <Home/>},
            {path: "/people", element: <People/>},
        ],
    },
])