import React, { useState, useEffect, useContext } from "react";
import authAxios from "../../interceptors";
import MateCmmnt from "./MateCmmnt";
import "../../assets/mateCmmnt.scss";
import { HttpHeadersContext } from "../../HttpHeadersProvider";

const MateCmmntList = ({ mateId }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const { headers, setHeaders } = useContext(HttpHeadersContext);

  // get
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await authAxios.get(`/mate/comments/${mateId}`);
        setComments(response.data);
      } catch (error) {
        console.error("댓글을 가져오는 중 오류 발생:", error);
        setError(error);
      }
    };
    fetchComments();
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    });
  }, [mateId]);

  // 좋아요
  const handleLike = async (commentId) => {
    try {
      const res = await authAxios.post(`/mate/comments/${commentId}/like`);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      setError(error);
    }
  };

  // 좋아요 취소
  const handleUnlike = async (commentId) => {
    try {
      const res = await authAxios.post(`/mate/comments/${commentId}/unlike`);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes - 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("좋아요 취소 처리 중 오류 발생:", error);
      setError(error);
    }
  };

  // 삭제
  const handleDelete = async (commentId) => {
    console.log(commentId);
    console.log(mateId);
    try {
      await authAxios.delete(`/mate/comments/${commentId}`, { headers });
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      setError(error);
    }
    window.location.replace(`/mate/${mateId}`);
  };

  // 수정
  const handleEdit = async (commentId) => {
    try {
      await authAxios.put(`/mate/comments/${commentId}`, { headers });
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      setError(error);
    }
  };
  if (!Array.isArray(comments)) {
    return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (!Array.isArray(comments)) {
    return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="comments-container">
      {comments.map((comment) => (
        <MateCmmnt
          key={comment.id}
          mateId={mateId}
          comment={comment}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default MateCmmntList;
