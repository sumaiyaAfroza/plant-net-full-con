import React, { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()
    const [role, setRole] = useState(null)
    const [isRoleLoading, setIsRoleLoading] = useState(true)

    
    useEffect(()=>{
        const fetchRole = async()=>{
            const {data} =await axiosSecure.get(`/users/role/${user?.email}`)
            
            setRole(data?.role)
            setIsRoleLoading(false)
        }

        fetchRole()
    },[axiosSecure, user])


    return [role, isRoleLoading]
};

export default useRole;