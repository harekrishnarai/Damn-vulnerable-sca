package com.acme.foo;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.tukaani.xz.LZMA2Options;
import org.tukaani.xz.XZOutputStream;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/files")
public class FileUploadApi {

	private static final Logger logger = LogManager.getLogger(FileUploadApi.class);


	private static final String UPLOAD_DIR = "uploads/";

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			// Ensure the uploads directory exists
			Path uploadPath = Paths.get(UPLOAD_DIR);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			// Get the file and save it
			byte[] bytes = file.getBytes();
			Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
			Files.write(path, bytes);

			Path zipPath = Paths.get(UPLOAD_DIR + file.getOriginalFilename() + ".xz");
			LZMA2Options options = new LZMA2Options();
			XZOutputStream xz = new XZOutputStream(Files.newOutputStream(zipPath), options);

			byte[] buf = new byte[8192];
			int size;
			while ((size = System.in.read(buf)) != -1) {
				xz.write(buf, 0, size);
			}

			xz.finish();

			return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully: " + file.getOriginalFilename() + " -> " + path + " -> " + zipPath);
		} catch (IOException e) {
			logger.error("Failed to upload file", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
		}
	}
}