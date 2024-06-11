import React, { useContext } from "react";
import authAxios from "../../../interceptors";
import { useNavigate } from "react-router-dom";
import { HttpHeadersContext } from "../../../HttpHeadersProvider";

const FileManager = (props) => {
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const todayId = props.todayId;
  const files = props.files;
  const navigate = useNavigate();

  /* 파일 삭제 */
  const fileDelete = async (todayId, fileId) => {
    try {
      const response = await authAxios.delete(
        `/today/${todayId}/file/delete?fileId=${fileId}`,
        { headers: headers }
      );
      console.log("[FielManager.js] fileDelete() success :D");
      console.log(response.data);

      navigate(0);
    } catch (error) {
      console.error("[FielManager.js] fileDelete() error :<");
      console.error(error);
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="file-box">
        <p>No files</p>
      </div>
    );
  }

  return (
    <div className="file-box">
      <ul>
        {files.map((file) => (
          <li
            key={file.fileId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>File Name:</strong> {file.originFileName} &nbsp;
              {/* 파일 다운로드 버튼 */}
              <a
                href={`/today/${todayId}/file/download?fileId=${file.fileId}`}
                download
              >
                Download
              </a>
            </span>
            {/* 삭제 버튼을 가장 오른쪽에 배치하기 */}
            <button
              style={{ marginRight: "20px", cursor: "pointer" }}
              onClick={() => fileDelete(todayId, file.fileId)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
