import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Reuse your existing styles
import { TypingDNA } from "../typingdna/typingdna.js"; // Provided API
import { AutocompleteDisabler } from "../typingdna/autocomplete-disabler.js"; // Provided API

export const TypingPattern = () => {
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

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
    tdnaRef.current.addTarget("password");
  }, []);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID is required!");
      return;
    }

    // Capture the typing pattern using type 1 (sametext pattern)
    const pattern = tdnaRef.current.getTypingPattern({
      type: 1,
      text: text,
    });
    console.log("Captured pattern:", pattern);

    try {
      const response = await fetch("http://localhost:5000/api/auth/typingdna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern, user_id: userId }),
      });
      const data = await response.json();
      console.log("TypingDNA response:", data);

      if (data.message_code === 10) {
        alert("Insufficient typing data. Please try again.");
      } else {
        if (data.result === 1) {
          alert("TypingDNA indicated HIGH confidence.");
        } else {
          alert("TypingDNA indicated LOW confidence.");
        }
        navigate("/");
      }
    } catch (error) {
      console.error("Error sending typing pattern:", error);
      alert("An error occurred while sending your typing pattern.");
    }

    // Reset typing pattern and clear input fields
    tdnaRef.current.reset();
    setText("");
    setUserId("");
  };

  return (
    <section>
      <main>
        <div className="wrapper" id="typing-pattern">
          <span className="icon-close" onClick={() => navigate("/")}>
            <ion-icon name="close"></ion-icon>
          </span>
          <div className="form-box typingpattern">
            <h2>Additional Typing Data</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="person"></ion-icon>
                </span>
                <input
                  type="text"
                  required
                  name="user_id"
                  id="user_id"
                  value={userId}
                  onChange={handleUserIdChange}
                  placeholder=""
                  autoComplete="off"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <label htmlFor="user_id">Email</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <ion-icon name="pencil"></ion-icon>
                </span>
                <input
                  type="password"
                  required
                  name="password"
                  id="password"
                  value={text}
                  onChange={handleTextChange}
                  placeholder=""
                  autoComplete="off"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn">
                Submit Typing Pattern
              </button>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};
