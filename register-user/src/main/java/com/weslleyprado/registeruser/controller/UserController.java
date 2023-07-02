package com.weslleyprado.registeruser.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.weslleyprado.registeruser.dto.UserDTO;
import com.weslleyprado.registeruser.service.UserService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    
 

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String[] sort
    ) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<UserDTO> userPage = userService.getAllUsers(pageable);
        return ResponseEntity.ok(userPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @RequestParam String code,
            @RequestParam String name,
            @RequestParam("dateOfBirth") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @RequestParam("photo") MultipartFile photo
    ) {
        UserDTO userDTO = new UserDTO();
        userDTO.setCode(code);
        userDTO.setName(name);
        userDTO.setDateOfBirth(dateOfBirth);

        UserDTO savedUser = userService.createUser(userDTO, photo);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestParam String code,
            @RequestParam String name,
            @RequestParam("dateOfBirth") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        UserDTO userDTO = new UserDTO();
        userDTO.setCode(code);
        userDTO.setName(name);
        userDTO.setDateOfBirth(dateOfBirth);

        UserDTO updatedUser = userService.updateUser(id, userDTO, photo);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
