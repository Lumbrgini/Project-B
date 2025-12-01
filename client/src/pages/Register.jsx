import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [status, setStatus] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({firstName, familyName, email, password}),
            });
            if(res.ok){
                setStatus("Check the console for the activation link.")
                console.log(JSON.stringify({firstName, familyName, email, password}));
                navigate("/home");
            } 
            if (res.status == 400){
                setStatus("Invalid E-Mail. Please, check your input and try again!")
            }
            else {
                setStatus("Something went wrong. Try again.");
            }
        } catch (err){
            console.error(err)
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
            </form>

            {status && <p>{status}</p>}
            <br/><br/>
            <p> Already have an account?</p>
            <button onClick={() => navigate("/login")}>Go to login</button>
        </>
    )
}

export default Register;