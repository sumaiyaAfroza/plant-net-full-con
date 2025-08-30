// import React, { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import {useQuery} from "@tanstack/react-query";

const useRole = () => {
    const {user , loading} = useAuth()
    const axiosSecure = useAxiosSecure()
    const email = user?.email

        const {data: role, isLoading: isRoleLoading} = useQuery({
            queryKey: ['role', email],
            enabled: !loading && !! email,
            queryFn: async () => {
                const {data} = await axiosSecure.get(`/users/role/${email}`)
                return data
            }
        })
    console.log(role)

    return [role?.role, isRoleLoading]

    // const [role, setRole] = useState(null)
    // const [isRoleLoading, setIsRoleLoading] = useState(true)
    // useEffect(()=>{
    //     const fetchRole = async()=>{
    //         if(!user) return setIsRoleLoading(false)
    //        try {
    //            const {data} =await axiosSecure.get(`/users/role/${user?.email}`)
    //            setRole(data?.role)
    //        }
    //         catch (error) {
    //             console.log(error)
    //         }
    //         finally {
    //         setIsRoleLoading(false)
    //        }
    //     }
    //     fetchRole()
    // },[axiosSecure, user])
};

export default useRole;