import Link from "next/link";
import Cookie from "js-cookie";
import Router from "next/router";

export default function Nav() {
  const logoutHandler = async (e) => {
    e.preventDefault();

    Cookie.remove("token");

    Router.replace("/auth/login");
  };
  return (
    <>
      <Link href="/posts">List Post</Link>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <Link href="/posts/create">Create Post</Link>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="#" onClick={logoutHandler.bind(this)}>
        Logout
      </a>
    </>
  );
}
