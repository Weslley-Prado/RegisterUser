package com.weslleyprado.registeruser.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class ImageController {

    @Value("${image.path}")
    private String imagePath;

    @GetMapping("/images/{fileName:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) throws IOException {
        Path image = Paths.get(imagePath, fileName);
        Resource resource = new UrlResource(image.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
        } else {
            throw new FileNotFoundException("Image not found: " + fileName);
        }
    }
}

