import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth } from "../store/auth";


export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const {storeTokenInLS} = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("Login Sucessful");
        const responseData = await response.json();
        storeTokenInLS(responseData.
          token);
        setUser({email:"",password:""});
        navigate("/");
      }else{
        alert("invalid credential");
        console.log("invalid credential");
      }
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <>
      <section>
        <main>
          <div className="wrapper">
            <span className="icon-close" onClick={event =>  window.location.href='/'}><ion-icon name="close-outline"></ion-icon></span>
            <div className="form-box login">
              <h2>Login</h2>
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="input-box">
                  <span className="icon"><ion-icon name="mail"></ion-icon></span>
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
                  <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
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
                <button type="submit" className="btn">Login</button>
                <div className="login-register">
                  <p>Don't have an account? <a href="/register" className="register-link">Register</a></p>
                </div>
              </form>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

