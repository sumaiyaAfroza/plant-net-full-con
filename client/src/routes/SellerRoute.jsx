import React from 'react';
import useRole from "../hooks/useRole.jsx";
import LoadingSpinner from "../components/Shared/LoadingSpinner.jsx";
import {Navigate} from "react-router";

const SellerRoute = ({children}) => {
    const [role, isRoleLoading] = useRole()
    if (isRoleLoading) return <LoadingSpinner />
    if (role === "seller") return children
    return <Navigate to='/' replace='true' />

};

export default SellerRoute;