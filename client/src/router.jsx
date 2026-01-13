import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import People from './pages/People.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import RequireAuth from './components/requireAuth/requireAuth.jsx';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <NotFound />,
    children: [
      {path: '/', element: <Register/>},
      {path: '/register', element: <Register/>},
      {path: '/login', element: <Login/>},
      {path: '/home', element: (
        <RequireAuth>
          <Home/>
        </RequireAuth>
      )},
      {path: '/people', element:(
        <RequireAuth>
          <People/>
        </RequireAuth>
      )},
    ],
  },
]);