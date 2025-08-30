import React from 'react';
import useAuth from "../hooks/useAuth.js";
import {Navigate, useLocation} from "react-router";
import LoadingSpinner from "../components/Shared/LoadingSpinner.jsx";
import useRole from "../hooks/useRole.jsx";

const AdminRoute = ({children}) => {
    const {role, isRoleLoading} = useRole()
    if (isRoleLoading) return <LoadingSpinner />
    if (role === "admin") return children
    return <Navigate to='/login' replace='true' />
}
export default AdminRoute;