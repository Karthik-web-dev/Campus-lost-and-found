import React from "react";
import { useParams, useNavigate } from "react-router";
import "../assets/itempage.css";
import { UserContext } from "../contexts/usercontext";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchUser } = React.useContext(UserContext);

    const [post, setPost] = React.useState({});
    const [author, setAuthor] = React.useState({});

    const [editingTitle, setEditingTitle] = React.useState(false);
    const [editingDescription, setEditingDescription] = React.useState(false);
    const [editingLocation, setEditingLocation] = React.useState(false);
    const [editingDateTime, setEditingDateTime] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState(false);
    const [editingImage, setEditingImage] = React.useState(false);
    const [editingItemType, setEditingItemType] = React.useState(false);

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [dateTime, setDateTime] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [imageFile, setImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState("");
    const [itemType, setItemType] = React.useState("");

    React.useEffect(() => {
        fetch(`http://localhost:5000/api/post/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data.body.post);
                setAuthor(data.body.author);
                setTitle(data.body.post.title);
                setDescription(data.body.post.description);
                setLocation(data.body.post.location);
                setDateTime(`${data.body.post.date}T${data.body.post.time || "00:00"}`);
                setCategory(data.body.post.category);
                setImagePreview(data.body.post.image_url);
                setItemType(data.body.post.type);
            });
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const [date, time] = dateTime.split("T");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", itemType);
        formData.append("category", category);
        formData.append("location", location);
        formData.append("date", date);
        formData.append("time", time);
        if (imageFile) formData.append("image", imageFile);

        fetch(`http://localhost:5000/api/edit/${id}`, {
            method: "POST",
            body: formData,
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    fetchUser();
                    navigate(`/posts`);
                } else {
                    alert(data.message);
                }
            });
    };

    return (
        <form className="page-container" onSubmit={handleSave}>
            <section className="image">
                {editingImage ? (
                    <div>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        <button type="button" onClick={() => setEditingImage(false)}>Done</button>
                    </div>
                ) : (
                    <img src={imagePreview || null} alt="Post" onClick={() => setEditingImage(true)} />
                )}
            </section>

            <section className="details">
                {editingTitle ? (
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setEditingTitle(false)}
                        autoFocus
                        style={{ fontSize: "2em", fontWeight: "bold" }}
                    />
                ) : (
                    <h1 onClick={() => setEditingTitle(true)}>{title}</h1>
                )}

                <p>
                    <strong>Brief Description:</strong>{" "}
                    {editingDescription ? (
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => setEditingDescription(false)}
                            autoFocus
                        />
                    ) : (
                        <span onClick={() => setEditingDescription(true)}>{description}</span>
                    )}
                </p>

                <p>
                    <strong>Item Type: </strong>
                    {editingItemType ? (
                        <select
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                            onBlur={() => setEditingItemType(false)}
                            autoFocus
                        >
                            <option value="found">Found</option>
                            <option value="lost">Lost</option>
                        </select>
                    ) : (
                        <span className="tag" onClick={() => setEditingItemType(true)}>
                            {itemType === "found" ? "Found" : "Lost"}
                        </span>
                    )}
                </p>

                <p>
                    <strong>Location: </strong>
                    {editingLocation ? (
                        <textarea
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onBlur={() => setEditingLocation(false)}
                            autoFocus
                        />
                    ) : (
                        <span onClick={() => setEditingLocation(true)}>{location}</span>
                    )}
                </p>

                <p>
                    <strong>{itemType === "found" ? "Found" : "Lost"} on: </strong>
                    {editingDateTime ? (
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            onBlur={() => setEditingDateTime(false)}
                            autoFocus
                        />
                    ) : (
                        <span onClick={() => setEditingDateTime(true)}>
                            {dateTime ? new Date(dateTime).toLocaleString() : ""}
                        </span>
                    )}
                </p>

                <p className="tag">
                    {editingCategory ? (
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            onBlur={() => setEditingCategory(false)}
                            autoFocus
                        >
                            <option value="Electronics">Electronics</option>
                            <option value="Documents">Documents</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Jewelry">Jewelry</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <span onClick={() => setEditingCategory(true)}>{category}</span>
                    )}
                </p>

                <hr />

                <h1>Details of the author of this post:</h1>
                <p><strong>Name: </strong>{author.name}</p>
                <p><strong>Division: </strong>{author.division}</p>

                <button type="submit" className="contact-btn">Save Changes</button>
            </section>
        </form>
    );
}
