package com.weslleyprado.registeruser.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.weslleyprado.registeruser.dto.UserDTO;
import com.weslleyprado.registeruser.entity.User;
import com.weslleyprado.registeruser.repository.UserRepository;
import com.weslleyprado.registeruser.util.UserMapper;


@Service
public class UserService {
	@Autowired
	private  UserRepository userRepository;
	
	 @Value("${image.path}")
	 private String imagePath;



    
	public Page<UserDTO> getAllUsers(Pageable pageable) {
	    Page<User> userPage = userRepository.findAll(pageable);
	    return userPage.map(user -> {
	        UserDTO userDTO = UserMapper.convertToDTO(user);
	        String photoFileName = userDTO.getPhoto().substring(userDTO.getPhoto().lastIndexOf('/') + 1);
	        userDTO.setPhoto(photoFileName);
	        return userDTO;
	    });
	}


	public UserDTO getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("User not found"));
		return UserMapper.convertToDTO(user);
	}

	public UserDTO createUser(UserDTO userDTO, MultipartFile photoFile) {
        try {
            File directory = new File(imagePath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(photoFile.getOriginalFilename());
            File file = new File(directory, fileName);
            photoFile.transferTo(file);

            // Copiar a imagem para o diretório do projeto
            Path destinationPath = Path.of("src/main/resources/static/images/", fileName);
            Files.copy(file.toPath(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

            // Obter o caminho relativo da imagem
            String relativeImagePath = "images/" + fileName;

            User user = UserMapper.convertToEntity(userDTO);
            user.setPhoto(relativeImagePath);

            User savedUser = userRepository.save(user);

            // Gerar a URL da imagem
            String photoUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/")
                    .path(relativeImagePath)
                    .toUriString();
            savedUser.setPhoto(photoUrl);

            return UserMapper.convertToDTO(savedUser);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process the photo file.");
        }
    }

	public UserDTO updateUser(Long id, UserDTO userDTO, MultipartFile photo) {
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("User not found"));

		existingUser.setCode(userDTO.getCode());
		existingUser.setName(userDTO.getName());
		existingUser.setDateOfBirth(userDTO.getDateOfBirth());

		try {
			if (photo != null && !photo.isEmpty()) {
				String photoDirectory = "C:/images";
				File directory = new File(photoDirectory);
				if (!directory.exists()) {
					directory.mkdirs();
				}

				// Deleta a foto existente, se houver
				String existingPhotoPath = existingUser.getPhoto();
				if (existingPhotoPath != null && !existingPhotoPath.isEmpty()) {
					File existingPhotoFile = new File(existingPhotoPath);
					existingPhotoFile.delete();
				}

				String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
				File file = new File(directory, fileName);
				photo.transferTo(file);

				existingUser.setPhoto(file.getAbsolutePath());
			}

			User savedUser = userRepository.save(existingUser);
			return UserMapper.convertToDTO(savedUser);
		} catch (IOException e) {
			throw new RuntimeException("Failed to process the photo file.");
		}
	}

	public void deleteUser(Long id) {
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("User not found"));

		String photoPath = existingUser.getPhoto();
		if (photoPath != null && !photoPath.isEmpty()) {
			File photoFile = new File(photoPath);
			if (photoFile.exists()) {
				photoFile.delete();
			}
		}

		userRepository.delete(existingUser);
	}
}
