import React, { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [fields, setFields] = useState({ email: "", password: "" });

  const [status, setStatus] = useState("normal");

  const registerHandler = async (e) => {
    e.preventDefault();

    setStatus("loading");

    const register = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!register.ok) return setStatus("error " + register.status);

    const registerRes = await register.json();

    setStatus("success");
  };

  const inputHandler = (e) => {
    const name = e.target.getAttribute("name");

    setFields({
      ...fields,
      [name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerHandler.bind(this)}>
        <input
          name="email"
          type="text"
          placeholder="Email..."
          onChange={inputHandler.bind(this)}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password..."
          onChange={inputHandler.bind(this)}
        />
        <br />
        <button type="submit">Register</button>
        <div>Output : {status}</div>
        <Link href="/auth/login">Login</Link>
      </form>
    </div>
  );
}
