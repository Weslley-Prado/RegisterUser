package com.weslleyprado.registeruser.util;

import com.weslleyprado.registeruser.dto.UserDTO;
import com.weslleyprado.registeruser.entity.User;

public class UserMapper {

    public static UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setCode(user.getCode());
        userDTO.setName(user.getName());
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setPhoto(user.getPhoto());
        return userDTO;
    }

    public static User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setCode(userDTO.getCode());
        user.setName(userDTO.getName());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setPhoto(userDTO.getPhoto());
        return user;
    }
}
