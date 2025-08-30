import { createBrowserRouter } from 'react-router'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import PlantDetails from '../pages/PlantDetails/PlantDetails'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import AddPlant from '../pages/Dashboard/Seller/AddPlant'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers'
import Profile from '../pages/Dashboard/Common/Profile'
import Statistics from '../pages/Dashboard/Common/Statistics'
import MainLayout from '../layouts/MainLayout'
import MyInventory from '../pages/Dashboard/Seller/MyInventory'
import ManageOrders from '../pages/Dashboard/Seller/ManageOrders'
import MyOrders from '../pages/Dashboard/Customer/MyOrders'
import SellerRoute from "./SellerRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
        loader: ()=> fetch(`${import.meta.env.VITE_API_URL}/plants`)
      },
      {
        path: '/plant/:id',
        element: <PlantDetails />
        // loader: ({ params }) =>
        //   fetch(`${import.meta.env.VITE_API_URL}/plant/${params.id}`),
      },
    ],
  },


  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },



  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },

      //   seller Route
      {
        path: 'add-plant',
        element: (
          <PrivateRoute>
              <SellerRoute>
                  <AddPlant />
              </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'my-inventory',
        element: (
          <PrivateRoute>
          <SellerRoute>
              <MyInventory />
          </SellerRoute>
          </PrivateRoute>
        ),
      },
      //   admin route
      {
        path: 'manage-users',
        element: (
          <PrivateRoute>
            <AdminRoute>
                <ManageUsers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-orders',
        element:
        <PrivateRoute>
            <SellerRoute>
                <ManageOrders />,
            </SellerRoute>
        </PrivateRoute>
      },
    ],
  },
])
