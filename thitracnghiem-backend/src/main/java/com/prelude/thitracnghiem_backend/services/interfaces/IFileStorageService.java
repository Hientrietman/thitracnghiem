package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.models.Media;
import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Set;

public interface IFileStorageService {
    @Transactional
    Set<Media> storeFiles(MultipartFile[] files, int questionId) throws IOException;


    Path getFilePath(int poolId, int questionId, String fileName);

    byte[] loadFile(String fileName) throws IOException;
}
