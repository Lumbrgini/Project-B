import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [status, setStatus] = useState(null);

    const navigate = useNavigate();

    // const handleSubmit = async(e) =>{
    //     e.preventDefault();

    //     try{
    //         const res = await fetch("/api/register", {
    //             method: "POST",
    //             headers: {
    //                 "Content-type": "application/json",
    //             },
    //             body: JSON.stringify({firstName, familyName, email, password}),
    //         });
    //         if(res.ok){
    //             console.log(JSON.stringify({firstName, familyName, email, password}));
    //             navigate("/home");
    //         } 
    //         if (res.status == 400){
    //             setStatus("Invalid E-Mail. Please, check your input and try again!")
    //         }
    //         else {
    //             setStatus("Something went wrong. Try again.");
    //         }
    //     } catch (err){
    //         console.error(err)
    //     }
    // }

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
            username: email,   
            password: password,
            client_id: "client", 
            }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Invalid username or password");
        }

        const data = await res.json();
        console.log("Token response:", data);



        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);

        navigate("/home");

        } catch (err) {
          console.error(err);
          setError(err.message);
      }
    }
    return(
        <>
            <h1>This is registration page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">First name:</label><br/>
                <input 
                    type="first_name" 
                    id="first_name" 
                    value={firstName} 
                    onChange = {e => setFirstName(e.target.value)}>
                </input>
                <br/><br/>
                <label htmlFor="family_name">Family name:</label><br/>
                <input
                    type="family_name"
                    id="family_name"
                    value={familyName}
                    onChange={e => setFamilyName(e.target.value)}>
                </input>
                <br/><br/>
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
                <button type="submit">Register</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>

            {status && <p>{status}</p>}
            <br/><br/>
            <p> Already have an account?</p>
            <button onClick={() => navigate("/login")}>Go to login</button>
        </>
    )
}

export default Register;