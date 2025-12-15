import React from "react";
import {io} from "socket.io-client"

export const SocketContext = React.createContext({
    socket: null,
    convId: -1
})

function handleDisconnect() {
    console.log("Will do it later")
}

export function SocketProvider({children, isAuthenticated}) {
    const [socket, setSocket] = React.useState(null)
    const convId = React.useRef(-1)
    console.log(isAuthenticated)

    React.useEffect(() => {
        if (!isAuthenticated) return
        const s = io('http://localhost:5000', {
            autoConnect: false,
            withCredentials:true
        }) //setup socket.io from client side 
    
        setSocket(s)
        s.connect()
        s.on("connect", () => {
            console.log("User connected: ", s.id)
        }) //connect event, change user status here
    
        return () => {handleDisconnect} //cleanup function 
    }, [isAuthenticated])

    return (
        <SocketContext.Provider value={{socket, convId}}> 
            {children}
        </SocketContext.Provider>
    )
}