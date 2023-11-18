import { FC, useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/Header";
import PostCard from "../components/PostCard";

export interface IPost {
  id: number;
  createdAt: string;
  content: string;
  title: string;
  user: {
    account: string;
  };
}

const Main: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<IPost[]>();

  const getMe = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAccount(response.data.account);
    } catch (error) {
      console.error(error);
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(`
        ${process.env.REACT_APP_BACK_URL}/post?page=${page}`);

      console.log(response);

      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMe();
    getPosts();
  }, []);

  return posts ? (
    <>
      <Header account={account} />
      <main className="max-w-screen-md mx-auto">
        <h1 className="mt-20 text-center font-bold text-2xl">게시판</h1>
        <ul className="mt-10 h-[440px]">
          <li className="flex justify-between border-b-2 font-semibold">
            <span className="w-2/12 p-2 text-center">아이디</span>
            <span className="w-6/12 p-2 text-center">제목</span>
            <span className="w-2/12 p-2 text-center">사용자</span>
            <span className="w-2/12 p-2 text-center">작성일</span>
          </li>
          {posts.map((v, i) => (
            <PostCard key={i} index={i} post={v} />
          ))}
        </ul>
        <ul className="flex text-lg justify-center">
          <li>페이지</li>
        </ul>
      </main>
    </>
  ) : (
    <div className="min-h-screen flex justify-center items-center text-3xl font-bold">
      Loading...
    </div>
  );
};

export default Main;
