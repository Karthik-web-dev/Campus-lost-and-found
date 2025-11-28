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

export default function App() {
  return(
    <BrowserRouter>    
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/chat" element={<Chat/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/lost" element={<ItemList isFound={false}/>}></Route>
          <Route path="/found" element={<Found/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
          <Route path="/about" element={<About/>}></Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}