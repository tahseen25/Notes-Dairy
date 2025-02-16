import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth } from "../store/auth";
import { TypingDNA } from "../typingdna/typingdna.js"; // Provided API
import { AutocompleteDisabler } from "../typingdna/autocomplete-disabler.js"; // Provided API

export const Register = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

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

    tdnaRef.current.addTarget("email");
    tdnaRef.current.addTarget("password");
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the registration API
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert("Registration successful!");

        // Capture a typing pattern using type 1 (sametext pattern)
        const pattern = tdnaRef.current.getTypingPattern({
          type: 1,
          text: user.email + user.password,
        });

        // Send the typing pattern data to the backend
        const patternResponse = await fetch(
          "http://localhost:5000/api/auth/typingdna",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pattern, user_id: responseData.user_id }),
          }
        );
        const patternData = await patternResponse.json();
        console.log("TypingDNA response:", patternData);

        // Handle TypingDNA confidence levels
        if (patternData.message_code === 10) {
          alert(
            "Insufficient typing data. Redirecting to additional typing data page."
          );
          navigate("/typing-pattern");
        } else {
          if (patternData.result === 1) {
            alert(
              "TypingDNA indicated HIGH confidence. You are successfully registered!"
            );
            // Only store token if high confidence
            storeTokenInLS(responseData.token);
            navigate("/");
          } else {
            alert(
              "TypingDNA indicated LOW confidence. Registration not confirmed. Please try again."
            );
            // Do not store the token, redirect to typing pattern page
            navigate("/typing-pattern");
          }
        }
        tdnaRef.current.reset();
      } else {
        console.log("Error in registration response:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="person"></ion-icon>
                </span>
                <input
                  autoComplete="off"
                  type="text"
                  required
                  name="username"
                  id="username"
                  value={user.username}
                  onChange={handleInput}
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
              <button type="submit" className="btn">
                Register
              </button>
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
