package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.services.implementation.FileStorageService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload/{questionId}")
    public ResponseEntity<String> uploadFiles(@RequestParam("files") MultipartFile[] files, @PathVariable int questionId) {
        try {
            // Lưu trữ các tệp và liên kết chúng với câu hỏi
            fileStorageService.storeFiles(files, questionId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Files uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading files: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            // Search for the file in the uploads directory recursively
            Path foundFilePath = findFileRecursively(Paths.get("uploads", "questionpool"), fileName);

            if (foundFilePath == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            File file = foundFilePath.toFile();

            // Create resource from the file
            Resource resource = new FileSystemResource(file);
            String contentType = getContentType(fileName);

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            System.out.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Helper method to recursively find a file
    private Path findFileRecursively(Path directory, String fileName) throws IOException {
        if (!Files.exists(directory)) {
            return null;
        }

        // Use Files.walk to search recursively through directories
        return Files.walk(directory)
                .filter(path -> path.getFileName().toString().equals(fileName))
                .findFirst()
                .orElse(null);
    }
    @GetMapping("/stream/{fileName}")
    public ResponseEntity<Resource> streamFile(
            @PathVariable String fileName,
            @RequestHeader(value = "Range", required = false) String range
    ) throws IOException {
        File videoFile = new File("uploads/" + fileName);
        long fileLength = videoFile.length();

        if (range == null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "video/mp4")
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(new FileSystemResource(videoFile));
        }

        // Parse Range Header
        String[] ranges = range.replace("bytes=", "").split("-");
        long start = Long.parseLong(ranges[0]);
        long end = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileLength - 1;

        long contentLength = end - start + 1;
        FileInputStream inputStream = new FileInputStream(videoFile);
        inputStream.skip(start);

        byte[] data = inputStream.readNBytes((int) contentLength);
        inputStream.close();

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .header(HttpHeaders.CONTENT_TYPE, "video/mp4")
                .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileLength)
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                .body(new ByteArrayResource(data));
    }

    // Hàm xác định kiểu MIME dựa trên phần mở rộng của file
    private String getContentType(String fileName) {
        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        switch (fileExtension) {
            case "mp4":
                return "video/mp4";
            case "mkv":
                return "video/x-matroska";
            case "mp3":
                return "audio/mpeg";
            case "wav":
                return "audio/wav";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "pdf":
                return "application/pdf";
            default:
                return "application/octet-stream";  // Default MIME type
        }
    }
}
