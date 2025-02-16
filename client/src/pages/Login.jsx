import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth } from "../store/auth";
import { TypingDNA } from "../typingdna/typingdna.js"; // Provided API
import { AutocompleteDisabler } from "../typingdna/autocomplete-disabler.js"; // Provided API

export const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  
  // Create refs to hold our TypingDNA instance
  const tdnaRef = useRef(null);
  const adRef = useRef(null);
  
  useEffect(() => {
    tdnaRef.current = new TypingDNA();
    adRef.current = new AutocompleteDisabler({
      showTypingVisualizer: true,
      showTDNALogo: true,
    });
    adRef.current.disableAutocomplete();
    adRef.current.disableCopyPaste();
    
    // Add input targets by their element IDs
    tdnaRef.current.addTarget("email");
    tdnaRef.current.addTarget("password");
  }, []);
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the login API
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      
      if (response.ok) {
        alert("Login Successful");
        const responseData = await response.json();
        setUser({ email: "", password: "" });
        
        // Capture a typing pattern using type 1 (sametext pattern)
        const pattern = tdnaRef.current.getTypingPattern({
          type: 1,
          text: user.email + user.password,
        });
        
        // Send the pattern to the backend for verification
        const patternResponse = await fetch("http://localhost:5000/api/auth/typingdna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pattern, user_id: responseData.user_id }),
        });
        const patternData = await patternResponse.json();
        console.log("TypingDNA response:", patternData);
        
        if (patternData.message_code === 10) {
          alert("Insufficient typing data. Redirecting to additional typing data page.");
          navigate("/typing-pattern");
        } else {
          if (patternData.result === 1) {
            alert("TypingDNA indicated HIGH confidence in your login.");
            // Only store token if high confidence
            storeTokenInLS(responseData.token);
            navigate("/");
          } else {
            alert("TypingDNA indicated LOW confidence. Please try again.");
            // Do not store token if low confidence
          }
        }
        tdnaRef.current.reset();
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  
  return (
    <section>
      <main>
        <div className="wrapper">
          <span
            className="icon-close"
            onClick={() => (window.location.href = "/")}
          >
            <ion-icon name="close-outline"></ion-icon>
          </span>
          <div className="form-box login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="mail"></ion-icon>
                </span>
                <input
                  autoComplete="off"
                  type="email"
                  required
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={handleInput}
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
                  id="password"
                  value={user.password}
                  onChange={handleInput}
                />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn">Login</button>
              <div className="login-register">
                <p>
                  Don't have an account?{" "}
                  <a href="/register" className="register-link">Register</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};
