import React from 'react';
import {Navigate} from "react-router";
import LoadingSpinner from "../components/Shared/LoadingSpinner.jsx";
import useRole from "../hooks/useRole.jsx";


const AdminRoute = ({children}) => {
   const [role, isRoleLoading] = useRole()
    console.log(role)

    if (isRoleLoading) return <LoadingSpinner />
    if (role === "admin") return children
    return <Navigate to='/' replace='true' />
}
export default AdminRoute;