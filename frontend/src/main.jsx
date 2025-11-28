import {createRoot} from "react-dom/client"
import App from "./App"
import { UserProvider } from "./contexts/usercontext"

const root = createRoot(document.getElementById("root"))
root.render(
    <UserProvider>
        <App />
    </UserProvider>
)