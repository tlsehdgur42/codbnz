import React, { useEffect, useState, useRef, useContext } from "react";
import authAxios from "../../interceptors";
import { useParams, useNavigate } from "react-router-dom";
import { HttpHeadersContext } from "../../HttpHeadersProvider";
import MateCmmntList from "./MateCmmntList";
import MateCmmntWrite from "./MateCmmntWrite";
import { AuthContext } from "../../AuthProvider";

import heart from "../../assets/icons/heart.png";
import fillHeart from "../../assets/icons/heart_selected_r.png";
import "../../assets/mateCmmnt.scss";
import "../../assets/mateDetail.scss";

const MateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { headers } = useContext(HttpHeadersContext);
  const { auth } = useContext(AuthContext);
  const [mate, setMate] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [likesCount, setLikesCount] = useState(0); // 좋아요 횟수

  const whiteContentRef = useRef(null);
  const whiteCommentRef = useRef(null);
  const blackContentRef = useRef(null);
  const blackCommentRef = useRef(null);

  // 그림자 - 48까지
  useEffect(() => {
    const updateHeights = () => {
      if (
        whiteContentRef.current &&
        whiteCommentRef.current &&
        blackContentRef.current &&
        blackCommentRef.current
      ) {
        const whiteContentHeight = whiteContentRef.current.offsetHeight;
        const whiteCommentHeight = whiteCommentRef.current.offsetHeight;

        blackContentRef.current.style.height = `${whiteContentHeight}px`;
        blackCommentRef.current.style.height = `${whiteCommentHeight}px`;
      }
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);

    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  useEffect(() => {
    fetchMateDetail();
    increaseHits();
  }, [id]);

  // 게시글 get
  const fetchMateDetail = async () => {
    try {
      const response = await authAxios.get(`/mate/detail/${id}`, {
        headers: headers,
      });
      setMate(response.data);
      setIsLiked(response.data.isLiked); // 서버에서 가져온 좋아요 상태 반영
      setLikesCount(response.data.likes); // 서버에서 가져온 좋아요 횟수 반영
    } catch (error) {
      console.error(error);
      setError("게시글 데이터를 불러오는데 실패했습니다.");
    }
  };

  const increaseHits = async () => {
    try {
      await authAxios.put(`/mate/hits/${id}`, null, {
        headers: headers,
      });
    } catch (error) {
      console.error("조회수 증가 중 오류 발생:", error);
    }
  };

  const handleCommentAdded = (newComment) => {
    setMate((prevMate) => ({
      ...prevMate,
      comments: [...prevMate.comments, newComment],
    }));
  };

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await authAxios.post(`http://localhost:8080/mate/unlike/${id}`, null, {
          headers: headers,
        });
        setLikesCount((prevLikes) => prevLikes - 1);
      } else {
        await authAxios.post(`http://localhost:8080/mate/like/${id}`, null, {
          headers: headers,
        });
        setLikesCount((prevLikes) => prevLikes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("좋아요 토글 중 오류 발생:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await authAxios.delete(`/mate/delete/${id}`, {
        headers: headers,
      });
      alert("삭제되었습니다.");
      navigate("/mate");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="detail_container mateContainer">
      <div className="detail_flex_column">
        {mate ? (
          <>
            <div
              className="mate_detail_category list_style"
              style={{ width: "300px" }}
            >
              <h4 className="detail_h4 ">분류</h4>
              <span>빈즈메이트</span>
              <span
                className="recruit"
                style={{ float: "right", color: "#66ccaa" }}
              >
                {mate.tag.recruit ? "모집중" : "모집완료"}
              </span>
            </div>

            <div>
              <div className="detail_title list_style">
                <h4 className="detail_h4">제목</h4>

                <span>{mate.title && mate.title}</span>
                <span style={{ float: "right", marginRight: "5px" }}>
                  {mate.hits}
                </span>
                <span style={{ float: "right", marginRight: "1px" }}>조회</span>
                <span style={{ float: "right", marginRight: "10px" }}>
                  {likesCount}
                </span>
                <span
                  style={{
                    float: "right",
                    marginRight: "1px",
                    cursor: "pointer",
                  }}
                  onClick={toggleLike}
                >
                  <img src={isLiked ? fillHeart : heart} alt="like" />
                </span>
                <span
                  style={{
                    float: "right",
                    color: "#ddd",
                    fontSize: "14px",
                    marginRight: "10px",
                  }}
                >
                  {new Date(mate.create_date).toLocaleDateString()}
                </span>
              </div>
              <div
                className="list_style"
                style={{
                  height: "500px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                id="white_box"
                ref={whiteContentRef}
              >
                <div className="detail_contents " id="white_content">
                  <h4 className="detail_h4 margin_h4">내용</h4>
                  <p>{mate.content && mate.content}</p>
                </div>
                <div>
                  <div className="detail_tag_flex">
                    <div className="detail_tag_wrap">
                      <div className="goal">
                        <p>{mate.tag.goal && mate.tag.goal}</p>
                      </div>

                      <div className="space">
                        <p>{mate.tag.space && mate.tag.space}</p>
                      </div>
                      <div className="langs">
                        {mate.tag.langs &&
                          mate.tag.langs.map((item, key) => {
                            return <p key={key}>{item}</p>;
                          })}
                      </div>
                      <div className="locas">
                        {mate.tag.locas &&
                          mate.tag.locas.map((item, key) => {
                            return <p key={key}>{item}</p>;
                          })}
                      </div>
                      <div className="parts">
                        {mate.tag.parts &&
                          mate.tag.parts.map((item, key) => {
                            return <p key={key}>{item}</p>;
                          })}
                      </div>
                    </div>
                  </div>

                  {mate.author && (
                    <div style={{ display: "flex" }} className="mate_author">
                      <p
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "100px",
                          overflow: "hidden",
                          marginRight: "10px",
                        }}
                      >
                        <img
                          style={{ width: "100%" }}
                          src={`http://localhost:3000/profile/${mate.author.profileIMG}`}
                          alt="profile"
                        />
                      </p>
                      <div className="mate_user">
                        <p>{mate.author.nickname}</p>
                        <p>{mate.author.profileMSG}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {auth.username === mate.author.username && (
                <div className="action_buttons">
                  <button
                    className="edit_button"
                    onClick={() => navigate(`/mate/edit/${id}`)}
                  >
                    수정
                  </button>
                  <button className="delete_button" onClick={handleDelete}>
                    삭제
                  </button>
                </div>
              )}
              <div
                className="list_style"
                id="white_comment"
                ref={whiteCommentRef}
              >
                {/* 댓글 목록 */}
                <MateCmmntList mateId={id} />
                {/* 댓글 작성 */}
                <MateCmmntWrite
                  mateId={id}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="detail_black_box" ref={blackContentRef}>
        <div className="detail_category detail_black_cont"></div>
        <div className="detail_title detail_black_cont"></div>

        <div
          className="detail_contents detail_black_cont"
          ref={blackContentRef}
        ></div>
        <div
          className="detail_right_wrap detail_black_cont"
          ref={blackCommentRef}
        ></div>
      </div>
    </div>
  );
};

export default MateDetail;
