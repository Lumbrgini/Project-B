import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import oAuthModel from "../../../server/oAuthModel";

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
        const res = await fetch("http://localhost:3000/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
            grant_type: "password",
            username: email,     // username === email (как в getUser)
            password: password,
            client_id: "client", // тот самый id из oAuthModel
            }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Invalid username or password");
        }

        const data = await res.json();
        console.log("Token response:", data);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        navigate("/home");

        // TODO: сделать редирект или записать юзера в контекст
        // navigate("/home") и т.п.
        } catch (err) {
          console.error(err);
          setError(err.message);
      }
    }


    return(
        <>
            <h1>This is login page</h1>
            <form onSubmit={handleSubmit}
            >
                <label htmlFor="email">Email:</label><br/>
                <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange = {e => setEmail(e.target.value)}>
                </input>
                <br/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}>
                </input>
                <br/><br/>
                <button type="submit">Login</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </>
    )
}

export default Login;