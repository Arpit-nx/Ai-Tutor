import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "/auth/login" : "/auth/register";

        try {
            const res = await axios.post(`http://127.0.0.1:5000${endpoint}`, formData);
            if (res.data.token) {
                // Store user details in localStorage
                const userData = { 
                    name: res.data.name || formData.name, 
                    email: formData.email, 
                    role: formData.role 
                };
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(userData));

                alert("Authentication Successful!");
                navigate("/dashboard");
            }
        } catch (error) {
            alert(error.response?.data?.error || "Error occurred!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Show name input only for Sign Up */}
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="auth-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-input"
                        required
                    />
                    <select name="role" value={formData.role} onChange={handleChange} className="auth-input">
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>
                    <button type="submit" className="auth-button">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}
