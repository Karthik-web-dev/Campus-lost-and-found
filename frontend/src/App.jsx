import React from "react"
import {Link, BrowserRouter, Routes, Route} from "react-router-dom"

import Header from "./components/header"
import Footer from "./components/footer"

import Home from "./pages/home"
import Chat from "./pages/chat"
import Signup from "./pages/signup"
import Login from "./pages/login"
import ItemList from "./pages/itemList"
import Contact from "./pages/contact"
import About from "./pages/aboutus"
import Found from "./pages/found"
import Post from "./pages/item"
import EditPost from "./pages/itemedit"

import { SocketProvider } from "./contexts/socketcontext"
import { UserProvider } from "./contexts/usercontext"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  return(
    <UserProvider setIsAuthenticated={setIsAuthenticated}>
      <SocketProvider isAuthenticated={isAuthenticated}>
        <BrowserRouter>    
          <div className="app-container">
            <Header auth={setIsAuthenticated}/>
            <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/chat" element={<Chat/>}></Route>
              <Route path="/signup" element={<Signup/>}></Route>
              <Route path="/login" element={<Login auth={setIsAuthenticated}/>}></Route>
              <Route path="/posts" element={<ItemList isFound={false}/>}></Route>
              <Route path="/report" element={<Found/>}></Route>
              <Route path="/contact" element={<Contact/>}></Route>
              <Route path="/about" element={<About/>}></Route>
              <Route path="/post/:id" element={<Post/>}></Route>
              <Route path="/post/edit/:id" element={<EditPost/>}></Route>
            </Routes>
            {/* <Footer /> */}
          </div>
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  )
}