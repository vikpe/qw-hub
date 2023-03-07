import React from "react";
import { useSelector } from "react-redux";
import { selectAllForumPosts } from "./services/hub/forumPosts.js";

export default function News() {
  const forumPosts = useSelector(selectAllForumPosts);
  const limit = 5;

  if (0 === forumPosts.length) {
    return <></>;
  }

  return (
    <div>
      <div className="font-bold text-gray-300/50 mb-2">FORUM ACTIVITY</div>
      {forumPosts.slice(0, limit).map((item, index) => (
        <a href={item.url} className="block" key={index}>
          {item.title}
          <span>({item.date})</span>
        </a>
      ))}
    </div>
  );
}