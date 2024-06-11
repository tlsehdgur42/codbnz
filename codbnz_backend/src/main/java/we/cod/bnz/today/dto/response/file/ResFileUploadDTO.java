package we.cod.bnz.today.dto.response.file;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import we.cod.bnz.today.entity.FileEntity;

/**
 * -Response-
 * 파일 업로드 후 응답 dto
 */

@Getter
@Setter
@NoArgsConstructor
public class ResFileUploadDTO {

    private Long fileId;
    private String originFileName;
    private String filePath;
    private String fileType;

    @Builder
    public ResFileUploadDTO(Long fileId, String originFileName, String filePath, String fileType) {
        this.fileId = fileId;
        this.originFileName = originFileName;
        this.filePath = filePath;
        this.fileType = fileType;
    }

    public static ResFileUploadDTO fromEntity(FileEntity file) {
        return ResFileUploadDTO.builder()
                .fileId(file.getId())
                .originFileName(file.getOriginFileName())
                .filePath(file.getFilePath())
                .fileType(file.getFileType())
                .build();
    }
}
