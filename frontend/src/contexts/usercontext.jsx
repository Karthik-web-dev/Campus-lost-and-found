import React from "react";

export const UserContext = React.createContext()

export function UserProvider({children}) {
        const [user, setUser] = React.useState(null)

        React.useEffect(() => {
        fetch('http://localhost:5000/api/me', {
            method: "GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.body?.loggedIn === true) {
                    setUser(data.body)
                } else {
                    setUser(null)
                }
                console.log(data)
            })
            .catch(err => {
                console.error(err)
                alert(err)
                setUser(null)
            })
    }, [])

    return (
    <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>)
}