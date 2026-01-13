import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Card } from "antd";

const { Title } = Typography;

function Login() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(values) {
        const { email, password } = values;
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

            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("refreshToken", data.refresh_token);

            navigate("/home");
        } catch (err) {
            console.error(err);
            setError("Invalid E-Mail or password.");
        }
    }

    return (
        <Card style={{ maxWidth: 400, margin: "80px auto" }}>
            <Title level={3}>Login</Title>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please enter your password" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Login;
