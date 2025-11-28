import React from "react";
import "../assets/found.css"
import { UserContext } from "../contexts/usercontext"
import { useNavigate } from "react-router";

export default function Found() {
        const {user, setUser} = React.useContext(UserContext)
        const navigate = useNavigate()

        const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("type", "found")

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
            navigate('/lost')
        })
        .catch(err => {
          console.error(err)
          alert("You are not logged in!")
          navigate('/login')
        });

    };

  return (
    <div className="form-container">
      <h2>REPORT A LOST ITEM</h2>

      <form onSubmit={handleSubmit}>
        <label>Item Lost:</label>
        <input name="title" type="text" required />

        <label>Description:</label>
        <textarea name="desc" required />

        <label>Location:</label>
        <input name="loc" type="text" required />

        <label>Date of Incident:</label>
        <input name="date" type="date" required />

        <label>Time of Incident:</label>
        <input name="time" type="time" required />

        <label>Category:</label>
        <select name="category" required>
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Other">Other</option>
        </select>

        <label>Upload Image (optional):</label>
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
