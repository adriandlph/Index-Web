import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layout/RootLayout.tsx'
import Home from './pages/Home.tsx'
import Division from './pages/Division.tsx'
import Department from './pages/Department.tsx'
import Project from './pages/Project.tsx'
import Product from './pages/Product.tsx'
import NotFound from './pages/NotFound.tsx'
import { ROUTES } from './config/routes.ts'

const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.division.replace('/', ''), element: <Division /> },
      { path: ROUTES.department.replace('/', ''), element: <Department /> },
      { path: ROUTES.project.replace('/', ''), element: <Project /> },
      { path: ROUTES.product.replace('/', ''), element: <Product /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
