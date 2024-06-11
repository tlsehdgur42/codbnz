import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { HttpHeadersContext } from "../../HttpHeadersProvider";
import { componentDidMount } from "../../Axios";
import { useNavigate } from "react-router-dom";
import authAxios from "../../interceptors";

import heart from "../../assets/icons/heart.png";
import fillHeart from "../../assets/icons/heart_selected_r.png";
import close from "../../assets/icons/close.png";
import edit from "../../assets/icons/bnzPlan.png";
import mateCmmnt from "../../assets/mateCmmnt.scss";

const MateCmmnt = ({ mateId, comment, onLike, onUnlike, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const [liked, setLiked] = useState(comment.liked); // 초기 좋아요 상태 설정

  // ★ 공통사항 ★ loginUser(로그인한 사용자) : 기본세팅
  const [loginUser, setLoginUser] = useState("");

  // ★ 공통사항 ★ 페이지 로딩 완료 시점 : 유저 정보 조회 → setLoginUser() → get() 실행

  // ★ get(res) ★ 경우에 따라 실행시킬 함수의 이름을 넣어주세용. 페이지 로딩과 동시에 실행될 함수 삽입, 없으면 삭제
  useEffect(() => {
    componentDidMount()
      .then((res) => {
        if (res === undefined || res === null) {
        } else {
          setLoginUser(res);
          get(res);
        }
      })
      .catch(setLoginUser(""));
  }, []);

  const [profile, setProfile] = useState({
    user_id: "",
    username: "",
    role: "",
    nickname: "",
    profileIMG: "",
    profileMSG: "",
  });

  // 로그인 유저 정보
  const get = async (loginUser) => {
    try {
      const res = await authAxios.get(`/my/get_account/${loginUser}`);
      setProfile(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const toggleLike = () => {
    if (liked) {
      onUnlike(comment.id);
    } else {
      onLike(comment.id);
    }
    setLiked(!liked);
  };

  return (
    <>
      <div className="mate_comments_container">
        {comment && (
          <div className="mate_com_flex">
            <p className="comment_proile_img">
              <img
                src={`http://localhost:3000/profile/${comment.writer.profileIMG}`}
              />
            </p>
            <div className="comment_wrap">
              <p>{comment.writer.nickname}</p>
              <p className="comment_proileMSG">{comment.writer.profileMSG}</p>
              <p className="comment_content">{comment.content}</p>
              <p
                className="comment_date"
                style={{ color: "#ddd", fontSize: "14px" }}
              >
                {new Date(comment.create_date).toLocaleString()}
              </p>
            </div>
            <div className="action_wrap">
              {auth === comment.writer.username && (
                <div className="comment_actions">
                  {/* <button onClick={() => onEdit(comment.id)}>수정</button> */}
                  <button onClick={() => onDelete(comment.id)}>삭제</button>
                </div>
              )}
              <div className="comment_likes" style={{ float: "right" }}>
                <img
                  src={liked ? fillHeart : heart}
                  alt={liked ? "fillHeart" : "heart"}
                  onClick={toggleLike}
                  style={{ cursor: "pointer" }}
                />
                <span className="todayFilledHeart">{comment.likes}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MateCmmnt;
