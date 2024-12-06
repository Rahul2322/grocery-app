import React, { useState } from "react";
import "./auth.css";
import axios from "axios";

interface LoginProps {
  onLogin: (user: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password
      });
console.log(user.data,"user.datata");

      if(!user.data.error){
        const token = user.data.token;
        console.log(token);
        
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user.data.data));
        onLogin(user.data.data.username)
      }
    } catch (error) {
        console.log(error);
        
    }
  
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
