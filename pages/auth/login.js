import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Router from "next/router";
import { unAuthPage } from "../../middlewares/authorizationPages";
import Link from "next/link";

export async function getServerSideProps(context) {
  await unAuthPage(context);

  return {
    props: {},
  };
}

export default function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("normal");

  const submitHandler = async (e) => {
    e.preventDefault();

    setStatus("loading...");

    const login = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!login.ok) return setStatus("error " + login.status);

    const loginRes = await login.json();

    setStatus("success");

    Cookie.set("token", loginRes.token);

    Router.push("/posts");
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
      <h1>Login</h1>
      <form onSubmit={submitHandler.bind(this)}>
        <input
          name="email"
          type="text"
          placeholder="Email.."
          onChange={inputHandler.bind(this)}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password.."
          onChange={inputHandler.bind(this)}
        />
        <br />
        <button type="submit">Login</button>
        <div>Status : {status}</div>
        <Link href="/auth/register">Register</Link>
      </form>
    </div>
  );
}
