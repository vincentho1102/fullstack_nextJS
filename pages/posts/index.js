import { authPage } from "../../middlewares/authorizationpages";
import React, { useState } from "react";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  const postReq = await fetch("http://localhost:3000/api/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const posts = await postReq.json();

  return {
    props: {
      postData: posts.data,
      token,
    },
  };
}

export default function PostsList({ postData, token }) {
  const [posts, setPosts] = useState(postData);

  const editHandler = (id) => {
    Router.push("/posts/update/" + id);
  };

  const deleteHandler = async (id, e) => {
    e.preventDefault();

    const ask = confirm("Apakah anda yakin menghapus data ini ?");

    if (ask) {
      const deletePost = await fetch(`/api/posts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await deletePost.json();

      const filteredData = posts.filter((post) => post.id !== id);

      setPosts(filteredData);
    }
  };

  return (
    <div>
      <h1>List Posts</h1>
      <Nav />
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h1>Title : {post.title}</h1>
            <h3>Content : {post.content}</h3>
            <button type="submit" onClick={editHandler.bind(this, post.id)}>
              Edit
            </button>
            &nbsp; &nbsp;
            <button type="submit" onClick={deleteHandler.bind(this, post.id)}>
              Delete
            </button>
            <br />
            <br />
          </div>
        );
      })}
    </div>
  );
}
