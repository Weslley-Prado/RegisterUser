package com.weslleyprado.registeruser.unittest;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.weslleyprado.registeruser.controller.UserController;
import com.weslleyprado.registeruser.dto.UserDTO;
import com.weslleyprado.registeruser.service.UserService;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers_shouldReturnListOfUsersDTO() {
        UserDTO userDTO1 = new UserDTO();
        UserDTO userDTO2 = new UserDTO();

        Page<UserDTO> userDTOPage = new PageImpl<>(List.of(userDTO1, userDTO2));

        Pageable pageable = Pageable.unpaged();

        when(userService.getAllUsers(pageable)).thenReturn(userDTOPage);

        verifyNoMoreInteractions(userService);
    }

    @Test
    void getUserById_withExistingUserId_shouldReturnUserDTO() {
        Long userId = 1L;
        UserDTO userDTO = new UserDTO();

        when(userService.getUserById(userId)).thenReturn(userDTO);

        ResponseEntity<UserDTO> result = userController.getUserById(userId);

        assertNotNull(result);
     

        verify(userService, times(1)).getUserById(userId);
        verifyNoMoreInteractions(userService);
    }

    @Test
    void getUserById_withNonExistingUserId_shouldThrowNoSuchElementException() {
        Long userId = 1L;

        when(userService.getUserById(userId)).thenThrow(NoSuchElementException.class);

        assertThrows(NoSuchElementException.class, () -> userController.getUserById(userId));

        verify(userService, times(1)).getUserById(userId);
        verifyNoMoreInteractions(userService);
    }

    @Test
    void createUser_shouldCreateUserAndReturnUserDTO() throws IOException {
        UserDTO userDTO = new UserDTO();
        MultipartFile photoFile = new MockMultipartFile("photo.jpg", "photo.jpg", "image/jpeg", new byte[0]);

        UserDTO savedUserDTO = new UserDTO();

        when(userService.createUser(any(UserDTO.class), any(MultipartFile.class))).thenReturn(savedUserDTO);

       
    }

    @Test
    void updateUser_withExistingUserId_shouldUpdateUserAndReturnUserDTO() throws IOException {
        Long userId = 1L;
        UserDTO userDTO = new UserDTO();
        MultipartFile photoFile = new MockMultipartFile("photo.jpg", "photo.jpg", "image/jpeg", new byte[0]);

        UserDTO updatedUserDTO = new UserDTO();

        when(userService.updateUser(eq(userId), any(UserDTO.class), any(MultipartFile.class))).thenReturn(updatedUserDTO);

        
    }

    @Test
    void deleteUser_withExistingUserId_shouldDeleteUser() {
        Long userId = 1L;

        doNothing().when(userService).deleteUser(userId);

        assertDoesNotThrow(() -> userController.deleteUser(userId));

        verify(userService, times(1)).deleteUser(userId);
        verifyNoMoreInteractions(userService);
    }
}
