import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return(
        <>
            <h1>This is login page</h1>
            <form //onSubmit={handleSubmit}
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
                <button type="submit" onClick={() =>  navigate("/home")}>Register</button>
            </form>
        </>
    )
}

export default Login;