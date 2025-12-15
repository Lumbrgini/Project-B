import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  function validate() {
    const e = email.trim().toLowerCase();
    const fn = firstName.trim();
    const ln = familyName.trim();

    if (!fn) return "First name is required.";
    if (!ln) return "Family name is required.";
    if (!e) return "E-Mail is required.";

    if (!password) return "Password is required.";

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      const registerRes = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          familyName: familyName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!registerRes.ok) {
        const data = await registerRes.json().catch(() => ({}));

        if (registerRes.status === 409) {
          throw new Error("This E-Mail is already registered.");
        }
        if (registerRes.status === 400) {
          throw new Error(data.error || data.message || "Invalid registration data.");
        }

        throw new Error(data.error || data.message || "Registration failed. Try again.");
      }

      const tokenRes = await fetch("http://localhost:3000/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "password",
          username: email.trim().toLowerCase(),
          password,
          client_id: "client",
        }),
      });

      if (!tokenRes.ok) {
        const data = await tokenRes.json().catch(() => ({}));
        throw new Error(data.error || "Registered, but login failed. Please login manually.");
      }

      const tokenData = await tokenRes.json();

      localStorage.setItem("accessToken", tokenData.access_token);
      localStorage.setItem("refreshToken", tokenData.refresh_token);

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <>
      <h1>This is registration page</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First name:</label><br />
        <input
          type="text"
          id="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br /><br />

        <label htmlFor="family_name">Family name:</label><br />
        <input
          type="text"
          id="family_name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
        <br /><br />

        <label htmlFor="email">Email:</label><br />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <label htmlFor="password">Password:</label><br />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Register</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <br /><br />
      <p>Already have an account?</p>
      <button onClick={() => navigate("/login")}>Go to login</button>
    </>
  );
}

export default Register;
