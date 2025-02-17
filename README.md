# Notes and Diary 📓

Welcome to **Notes and Diary**, a secure and intuitive platform for jotting down your thoughts, notes, and daily experiences. This project leverages **TypingDNA** for authentication, ensuring an added layer of security by verifying your unique typing patterns.

## 🚀 Features
- **Secure Authentication**: Utilizes TypingDNA to analyze typing patterns, enhancing account security.
- **Diary & Notes**: Write, edit, and organize personal notes and diary entries effortlessly.
- **Responsive Design**: Accessible across all devices with a clean and modern UI.
- **No Autocomplete or Copy-Paste**: Autocomplete and copy-paste are disabled to maintain the integrity of TypingDNA's authentication.

---

## 🛠️ Technologies Used
- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Authentication**: TypingDNA
- **Database**: MongoDB

---

## 🔧 Installation & Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/tahseen25/Notes-Dairy.git
    cd Notes-Dairy
    ```

2. **Install Dependencies**:
    - **Client**:
      ```bash
      cd client
      npm install
      ```
    - **Server**:
      ```bash
      cd ../server
      npm install
      ```

3. **Environment Variables**:
    - Create a `.env` file in the server directory with the following:
      ```env
      MONGO_URI=your_mongo_db_uri
      JWT_SECRET=your_jwt_secret
      ```

4. **Run the Application**:
    - **Client**:
      ```bash
      cd client
      npm run dev
      ```
    - **Server**:
      ```bash
      cd ../server
      nodemon server.js
      ```

5. **Access the Website**:
    Open your browser and navigate to: `http://localhost:3000`

---

## 📸 Screenshots
- *Registration with TypingDNA Authentication*
  ![Screenshot 2025-02-17 212149](https://github.com/user-attachments/assets/d991f363-f436-4704-ac51-9462157dd39a)

- *Login Page*
  ![Screenshot 2025-02-17 212149](https://github.com/user-attachments/assets/993ef250-b69e-4a2a-9c0d-2fe180721d0b)

- *Notes & Diary Dashboard*
![Screenshot 2025-02-17 214023](https://github.com/user-attachments/assets/6eeba95f-0de2-4140-8eba-3aac1b197f23)

---


## 🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.

---

## 📄 License
This project is licensed under the MIT License.

---

## ✨ Acknowledgements
- [TypingDNA](https://www.typingdna.com/) for innovative typing biometrics.
- Inspiration from modern note-taking and diary applications.
