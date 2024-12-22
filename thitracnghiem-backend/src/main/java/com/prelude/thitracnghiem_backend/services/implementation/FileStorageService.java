package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.models.Media;
import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.repositories.MediaRepository;
import com.prelude.thitracnghiem_backend.repositories.QuestionRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.IFileStorageService;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Data
@Service
public class FileStorageService implements IFileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final MediaRepository mediaRepository;
    private final QuestionRepository questionRepository;

    public FileStorageService(MediaRepository mediaRepository, QuestionRepository questionRepository) {
        this.mediaRepository = mediaRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    @Transactional
    public Set<Media> storeFiles(MultipartFile[] files, int questionId) throws IOException {
        // Tìm câu hỏi dựa trên questionId
        Question question = questionRepository.findById(questionId).orElseThrow(
                () -> new IOException("Question not found")
        );

        // Tạo đường dẫn thư mục lưu trữ cho question pool và question
        Path questionPoolDir = Paths.get(uploadDir, "questionpool",
                String.valueOf(question.getPool().getQuestionPoolId()));
        Path questionDir = questionPoolDir.resolve(String.valueOf(questionId));

        // Tạo các thư mục nếu chưa tồn tại
        Files.createDirectories(questionDir);

        // Lưu các tệp vào thư mục
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];

            // Lấy phần mở rộng của file
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // Tạo tên file mới theo qui tắc: {questionId}-{stt}.{extension}
            String newFileName = questionId + "-" + (i + 1) + fileExtension;
            Path filePath = questionDir.resolve(newFileName);

            // Lưu tệp vào thư mục
            Files.write(filePath, file.getBytes());

            // Tạo và lưu đối tượng Media vào cơ sở dữ liệu
            Media media = new Media();
            media.setFileName(newFileName);
            media.setFileType(file.getContentType());
            media.setFilePath(filePath.toString());
            media.setFileSize(file.getSize());
            media.setQuestion(question); // Liên kết với câu hỏi

            // Lưu vào cơ sở dữ liệu
            mediaRepository.save(media);
        }

        // Trả về tất cả các tệp đã lưu
        return question.getMediaFiles();
    }
    @Override
    public Path getFilePath(int poolId, int questionId, String fileName) {
        return Path.of(uploadDir, "questionpool", String.valueOf(poolId), String.valueOf(questionId), fileName);
    }


    @Override
    public byte[] loadFile(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir, "questionpool").resolve(fileName);
        return Files.readAllBytes(filePath);
    }
}
