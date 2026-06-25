import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        const data = await registerUser(username, email, password);
        if (data.message && !data.token) {
          setError(data.message);
          return;
        }
        setIsRegister(false);
      } else {
        const data = await loginUser(email, password);
        if (!data.token) {
          setError(data.message || "Login failed");
          return;
        }
        onLoginSuccess(data.token);
      }
    } catch {
      setError("Something went wrong. Check your connection.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsRegister(!isRegister)} style={{ cursor: "pointer" }}>
          {isRegister ? "Login here" : "Register here"}
        </button>
      </p>
    </div>
  );
}

export default Login;
