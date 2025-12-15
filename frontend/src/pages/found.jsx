import React from "react";
import "../assets/found.css"
import { UserContext } from "../contexts/usercontext"
import { useNavigate } from "react-router";

export default function Found() {
        const {user, setUser} = React.useContext(UserContext)
        const navigate = useNavigate()

        const handleSubmit = (e) => {
        e.preventDefault();
        // if (user?.loggedIn === false) {
        //   alert("You are not logged in!")
        //   return
        // }
        const formData = new FormData(e.target);

        const file = formData.get("image"); 
        console.log("Image file:", file);
        fetch("http://localhost:5000/api/create", {
            method: "POST",
            credentials:"include",
            body: formData
        })
        .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
              }
        })
        .then(data => {
            console.log(data)
            alert("Success!")
            navigate('/posts')
        })
        .catch(err => {
          console.error(err)
          alert("You are not logged in!")
        });

    };

  return (
    <div className="form-container">
      <h2>MAKE A REPORT</h2>

      <form onSubmit={handleSubmit}>
        <label>Item Lost:</label>
        <input name="title" type="text" required />

        <label>Description:</label>
        <textarea name="desc" required />

        <label>Type:</label>
        <select name="type" defaultValue={""} required>
          <option value="" disabled>Select Type</option>
          <option value="lost">Lost my Item</option>
          <option value="found">Found someone's Item</option>
        </select>

        <label>Location:</label>
        <input name="loc" type="text" required />

        <label>Date of Incident:</label>
        <input name="date" type="date" required />

        <label>Time of Incident:</label>
        <input name="time" type="time" required />

        <label>Category:</label>
        <select name="category" defaultValue={""} required>
          <option value="" disabled>Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Other">Other</option>
        </select>

        <label>Upload Image :</label>
        <input name="image" type="file" accept="image/*" />

        {/* <label>Your Message:</label>
        <textarea /> */}
{/* 
        <div className="checkbox-container">
          <input type="checkbox" required />
          <span>I confirm the information provided is accurate.</span>
        </div> */}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
