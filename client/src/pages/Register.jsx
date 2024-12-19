import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth } from "../store/auth";


export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const {storeTokenInLS} = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const responseData = await response.json();
        storeTokenInLS(responseData.token);
        alert("Registration successful");
        setUser({ username: "", email: "", password: "" });
        navigate("/");
        console.log(responseData);
      } else {
        console.log("Error inside response: ", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section>
      <main>
        <div className="wrapper" id="register">
          <span
            className="icon-close"
            onClick={() => (window.location.href = "/")}
          >
            <ion-icon name="close"></ion-icon>
          </span>
          <div className="form-box register">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit} autoComplete="off" >
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="person"></ion-icon>
                </span>
                <input
                  autoComplete="off"
                  type="text"
                  required
                  name="username"
                  value={user.username}
                  onChange={handleInput}
                  id="username"
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="mail"></ion-icon>
                </span>
                <input
                  autoComplete="off"
                  type="email"
                  required
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  id="email"
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="lock-closed"></ion-icon>
                </span>
                <input
                  autoComplete="off"
                  type="password"
                  required
                  name="password"
                  value={user.password}
                  onChange={handleInput}
                  id="password"
                />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn">Register</button>
              <div className="login-register">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="login-link">
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};
