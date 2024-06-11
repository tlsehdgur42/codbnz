import React, { useContext, useState, useEffect } from "react";
import authAxios from "../../interceptors";
import { AuthContext } from "../../AuthProvider";
import { HttpHeadersContext } from "../../HttpHeadersProvider";

const MateCmmntWrite = ({ mateId, onCommentAdded }) => {
  const { auth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    });
  }, [setHeaders]);

  if (!auth || !auth.isAuthenticated) {
    return <div>로그인 후 이용해주세요!</div>;
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAxios.post(
        `/comment/create`,
        {
          mateId: mateId,
          content: comment,
        },
        {
          headers: headers,
        }
      );

      if (response.status === 200) {
        setComment("");
        if (onCommentAdded) {
          onCommentAdded(response.data);
        }
      } else {
        setError("댓글 추가에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("댓글 추가에 실패했습니다:", error);
      setError("댓글 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 작성하세요"
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MateCmmntWrite;
