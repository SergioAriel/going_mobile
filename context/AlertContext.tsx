
import React, { createContext, useContext, useEffect, useState } from "react"

interface Alert {
    status: boolean,
    message: string,
    isError: boolean
}

interface AlertContextType extends Alert {
    handleAlert: (info: { message: string, isError: boolean }) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlert] = useState<Alert>({
        status: false,
        message: "",
        isError: false
    })

    useEffect(()=>{
        if(alert.status){
            setTimeout(()=>{
                setAlert({
                    ...alert,
                    status:false
                })
            },3000)
        }
    },[alert])

    const handleAlert = (info: { message: string, isError: boolean }) => {
        setAlert({
            ...info,
            status: true
        })
    }

    return (
        <AlertContext.Provider
            value={{ ...alert, handleAlert }}
        >
            {children}
        </AlertContext.Provider>
    )
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within a AlertProvider");
    }
    return context;
};