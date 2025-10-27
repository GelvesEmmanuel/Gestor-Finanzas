import React from "react";
import {Navigate, Outlet} from "react-router-dom"
import { useAuth } from "../context/authContext";

//comprobar si el usuario esta logeado y redireccione a las paginas protejidas
function ProtectedRoutes(){
    const { loading, isAuthenticated} = useAuth()
    console.log(loading,  isAuthenticated)



    if(loading) return <h1>
        loading....
    </h1>
    if(!loading && !isAuthenticated) return <Navigate to='/login' replace />
    return (
        <Outlet/>
    )
}

export default ProtectedRoutes