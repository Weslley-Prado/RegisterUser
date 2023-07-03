package com.weslleyprado.registeruser.unittest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.weslleyprado.registeruser.dto.UserDTO;
import com.weslleyprado.registeruser.entity.User;
import com.weslleyprado.registeruser.repository.UserRepository;
import com.weslleyprado.registeruser.service.UserService;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers_shouldReturnListOfUsersDTO() {
        List<User> users = new ArrayList<>();
        users.add(new User(1L, "user1", "John Doe", LocalDate.now(), null));
        users.add(new User(2L, "user2", "Jane Smith", LocalDate.now(), null));

        Page<User> userPage = new PageImpl<>(users);

        Pageable pageable = Pageable.unpaged();

        when(userRepository.findAll(pageable)).thenReturn(userPage);

        verifyNoMoreInteractions(userRepository);
    }


    @Test
    void getUserById_withExistingUserId_shouldReturnUserDTO() {
        Long userId = 1L;
        User user = new User(userId, "user1", "John Doe", LocalDate.now(), null);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserDTO userDTO = userService.getUserById(userId);

        assertNotNull(userDTO);
        assertEquals(user.getName(), userDTO.getName());

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void getUserById_withNonExistingUserId_shouldThrowNoSuchElementException() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> userService.getUserById(userId));

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void createUser_shouldCreateUserAndReturnUserDTO() throws IOException {
        UserDTO userDTO = new UserDTO(null, "user1", "John Doe", LocalDate.now(), null);
        MultipartFile photoFile = new MockMultipartFile("photo", "photo.jpg", "image/jpeg", new byte[0]);

        when(userRepository.save(any(User.class))).thenReturn(new User(1L, "user1", "John Doe", LocalDate.now(), "C:/images/photo.jpg"));

        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void updateUser_withExistingUserId_shouldUpdateUserAndReturnUserDTO() throws IOException {
        Long userId = 1L;
        User existingUser = new User(userId, "user1", "John Doe", LocalDate.now(), "C:/images/photo.jpg");
        UserDTO userDTO = new UserDTO(userId, "user1", "John Doe Updated", LocalDate.now(), null);
        MultipartFile photoFile = new MockMultipartFile("photo", "photo.jpg", "image/jpeg", new byte[0]);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(new User(userId, "user1", "John Doe Updated", LocalDate.now(), "C:/images/photo.jpg"));

        UserDTO updatedUserDTO = userService.updateUser(userId, userDTO, photoFile);

        assertNotNull(updatedUserDTO);
        assertEquals(userDTO.getName(), updatedUserDTO.getName());

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(User.class));
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void updateUser_withNonExistingUserId_shouldThrowNoSuchElementException() {
        Long userId = 1L;
        UserDTO userDTO = new UserDTO(userId, "user1", "John Doe Updated", LocalDate.now(), null);
        MultipartFile photoFile = new MockMultipartFile("photo", "photo.jpg", "image/jpeg", new byte[0]);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> userService.updateUser(userId, userDTO, photoFile));

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void deleteUser_withExistingUserId_shouldDeleteUserAndPhotoFile() {
        Long userId = 1L;
        User existingUser = new User(userId, "user1", "John Doe", LocalDate.now(), "C:/images/photo.jpg");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        userService.deleteUser(userId);

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).delete(existingUser);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void deleteUser_withNonExistingUserId_shouldThrowNoSuchElementException() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> userService.deleteUser(userId));

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
    }
}
