import React from "react";

export const UserContext = React.createContext()

export function UserProvider({children, setIsAuthenticated}) {
        const [user, setUser] = React.useState(null)

        const fetchUser = async () => {
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
                    setIsAuthenticated(data.body?.loggedIn)
                } else {
                    setUser(null)
                    setIsAuthenticated(data.body?.loggedIn)
                }
                console.log("CONTEXT: ", data, "\n", user)
            })
                    .catch(err => {
                console.error(err)
                alert(err)
                setUser(null)
            })
        }

        React.useEffect(() => {
            fetchUser();
    }, [])
    console.log("USER print in userContext: ", user)

    return (
    <UserContext.Provider value={{user, setUser, fetchUser}}>
        {children}
    </UserContext.Provider>)
}