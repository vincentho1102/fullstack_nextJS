import { authPage } from "../../../middlewares/authorizationpages";
import Router from "next/router";
import React, { useState } from "react";
import Nav from "../../../components/Nav";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  const { id } = context.params;

  const postReq = await fetch(`http://localhost:3000/api/posts/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const post = await postReq.json();

  return {
    props: {
      token,
      postData: post.data,
    },
  };
}

export default function updatePost({ postData, token }) {
  const [fields, setFields] = useState({
    title: postData.title,
    content: postData.content,
  });

  const [status, setStatus] = useState("normal");

  const submitHandler = async (e) => {
    e.preventDefault();

    setStatus("Loading...");

    const updateData = await fetch(`/api/posts/update/${postData.id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!updateData.ok) return setStatus("error : " + updateData.status);

    const updateRes = await updateData.json();

    setStatus("sucess...");

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
      <h1>Edit Post</h1>
      <Nav />
      <form onSubmit={submitHandler.bind(this)}>
        <br />
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          name="title"
          placeholder="Title..."
          value={fields.title}
          onChange={inputHandler.bind(this)}
        />
        <br />
        <label htmlFor="content">Content</label>
        <br />
        <input
          type="text"
          name="content"
          placeholder="Content..."
          value={fields.content}
          onChange={inputHandler.bind(this)}
        />
        <br />
        <button type="submit">Update</button>
        <div>Status : {status}</div>
      </form>
    </div>
  );
}
