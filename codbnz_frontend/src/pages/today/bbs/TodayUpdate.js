import authAxios from "../../../interceptors";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../../../AuthProvider";
import { HttpHeadersContext } from "../../../HttpHeadersProvider";
import "../../../assets/todaypage.scss";

function TodayUpdate() {
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { today } = location.state;

  const todayId = today.todayId;
  const [title, setTitle] = useState(today.title);
  const [content, setContent] = useState(today.content);
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState(today.thumbnails || []);
  const [severFiles, setSeverFiles] = useState(today.files || []);
  const [answerStatus, setAnswerStatus] = useState("NOT_APPLICABLE");

  const thumbnailInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeFile = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleChangeThumbnail = (event) => {
    const thumbnailFile = event.target.files[0];
    setThumbnails(thumbnailFile ? [thumbnailFile] : []);
  };

  const handleRemoveThumbnail = () => {
    setThumbnails([]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemoveSeverFile = (index, todayId, fileId) => {
    setSeverFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    fileDelete(todayId, fileId);
  };

  useEffect(() => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    });
  }, []);

  const handleChangeStatus = (event) => {
    setAnswerStatus(event.target.value);
  };

  const fileUpload = async (todayId) => {
    const fd = new FormData();
    files.forEach((file) => fd.append(`file`, file));

    await authAxios
      .post(`/today/${todayId}/file/upload`, fd, { headers })
      .then((resp) => {
        console.log("[file.js] fileUpload() success :D");
        console.log(resp.data);
        navigate(`/today/${todayId}`);
      })
      .catch((err) => {
        console.log("[FileData.js] fileUpload() error :<");
        console.log(err);
      });
  };

  const thumbnailUpload = async (todayId) => {
    if (thumbnails.length === 0) return;

    try {
      const fd = new FormData();
      fd.append("thumbnail", thumbnails[0]);

      const response = await authAxios.post(
        `/today/${todayId}/file/thumbnail/upload`,
        fd,
        { headers }
      );

      console.log("[TodayUpdate.js] thumbnailUpload() success :D");
      console.log(response.data);
    } catch (error) {
      console.log("[TodayUpdate.js] thumbnailUpload() error :<");
      console.log(error);
    }
  };

  const fileDelete = async (todayId, fileId) => {
    try {
      await authAxios.delete(`/today/${todayId}/file/delete?fileId=${fileId}`, {
        headers,
      });
      console.log("[TodayUpdate.js] fileDelete() success :D");
    } catch (error) {
      console.error("[TodayUpdate.js] fileDelete() error :<");
      console.error(error);
    }
  };

  const updateToday = async () => {
    const req = {
      id: auth,
      title,
      content,
      answerStatus,
    };

    try {
      const updateResponse = await authAxios.patch(
        `/today/${today.todayId}/update`,
        req,
        { headers }
      );

      console.log("[TodayUpdate.js] updateToday() success :D");
      console.log(updateResponse.data);
      const updatedTodayId = updateResponse.data.todayId;

      if (files.length > 0) {
        await fileUpload(updatedTodayId);
      }

      if (thumbnails.length > 0) {
        await thumbnailUpload(updatedTodayId);
      }

      navigate(`/today/${updatedTodayId}`);
    } catch (error) {
      console.log("[TodayUpdate.js] updateToday() error :<");
      console.log(error);
    }
  };

  return (
    <>
      <div id="today_detail" className="inner_m">
        <div className="black_box">
          <div className="cate"></div>
          <div className="status"></div>
          <div className="title"></div>
          <div className="cont"></div>
          <div className="thum"></div>
        </div>
        <div className="inner_box">
          <div className="cate">
            <span>분류</span>
            <h4>빈즈투데이</h4>
          </div>
          <div className="status">
            <span>상태</span>
            <h4>
              <select
                className="form-control"
                value={answerStatus}
                onChange={handleChangeStatus}
              >
                <option value="IN_PROGRESS">궁금해요</option>
                <option value="COMPLETED">해결됬어요!</option>
                <option value="NOT_APPLICABLE">잡담</option>
              </select>
            </h4>
          </div>
          <div className="title">
            <span>제목</span>
            <h4>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={handleChangeTitle}
                placeholder="제목을 입력하세요"
              />
            </h4>
          </div>
          <div className="cont">
            <span>내용</span>
            <h4>
              <textarea
                name="today_content"
                value={content}
                onChange={handleChangeContent}
                placeholder="게시글 내용을 입력하세요"
                cols={80}
                rows={15}
              ></textarea>
            </h4>
          </div>
          <div className="thum">
            <span>썸네일</span>
            <h4>파일을 등록해주세요</h4>
                        {thumbnails.map((thumbnail, index) => (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={URL.createObjectURL(thumbnail)}
                              alt={`Thumbnail ${index}`}
                              style={{ width: "280px", height: "280px" }}
                            />
                            <button
                              className="delete-button"
                              type="button"
                              onClick={handleRemoveThumbnail}
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "red",
                                fontSize: "22px",
                              }}
                            >
                              x
                            </button>
                          </div>
                        ))}
                        {thumbnails.length === 0 && (
                          <span>
                            최대 파일 크기 : 5MB <br />
                            이미지 사이즈 : 420 * 300 (px)
                            <br />
                            확장자 : JPG, JPEG, PNG, GIF, TIFF, BMP, EPS, SVG
                          </span>
                        )}
                        <input
                          type="file"
                          name="thumbnail"
                          ref={thumbnailInputRef}
                          onChange={handleChangeThumbnail}
                        />
                        <div className="file_text">첨부파일</div>
                        <h4>파일을 불러와주세요</h4>
                        {files.map((file, index) => (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <p>
                              <strong>FileName:</strong> {file.name}
                            </p>
                            <button
                              className="delete-button"
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "red",
                                fontSize: "22px",
                              }}
                            >
                              x
                            </button>
                          </div>
                        ))}
                        {files.length < 5 && (
                          <div>
                            <input
                              type="file"
                              name="file"
                              ref={fileInputRef}
                              onChange={handleChangeFile}
                              multiple
                            />
                          </div>
                        )}
                      </div>

                      <button type="submit" className="create_link" onClick={updateToday}>
                        수정하기
                      </button>
                    </div>
                  </div>
                </>
              );
            }

            export default TodayUpdate;