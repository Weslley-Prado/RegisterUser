package com.weslleyprado.registeruser.dto;

import java.time.LocalDate;

public class UserDTO {
    private Long id;
    private String code;
    private String name;
    private LocalDate dateOfBirth;
    private String photo;


    // Construtores

    public UserDTO() {
    }

    public UserDTO(Long id, String code, String name, LocalDate dateOfBirth, String photo) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.photo = photo;
    }
    

    
    

	// Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }


    
    
}
