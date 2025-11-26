import React from "react"
import {Link, BrowserRouter, Routes, Route} from "react-router-dom"

import Header from "./components/header"
import Home from "./pages/home"
import Chat from "./pages/chat"
import Signup from "./pages/signup"
import Login from "./pages/login"
import ItemList from "./pages/itemList"

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
          <Route path="/found" element={<ItemList isFound={true}/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}