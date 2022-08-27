import React, { useState } from "react";
import { authPage } from "../../middlewares/authorizationpages";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {
      token,
    },
  };
}

export default function CreatePost({ token }) {
  const [fields, setFields] = useState({
    title: "",
    content: "",
  });

  const [status, setStatus] = useState("normal");

  const submitHandler = async (e) => {
    e.preventDefault();

    setStatus("Loading...");

    const saveData = await fetch("/api/posts/create", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!saveData.ok) return setStatus("error " + saveData.status);

    const saveRes = await saveData.json();

    setStatus("success");

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
      <h1>Create Post</h1>
      <Nav />
      <form onSubmit={submitHandler.bind(this)}>
        <br />
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          name="title"
          placeholder="Title..."
          onChange={inputHandler.bind(this)}
        />
        <br />
        <label htmlFor="title">Content</label>
        <br />
        <textarea
          type="text"
          name="content"
          placeholder="Content..."
          onChange={inputHandler.bind(this)}
        />
        <br />
        <button type="submit">Save</button>
        <div>Status : {status}</div>
      </form>
    </div>
  );
}
