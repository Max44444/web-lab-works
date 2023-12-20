package com.example.lab5.dto;

public record UserDataRequest(
        String email,
        String password,
        String name,
        String group,
        String variant,
        String phone
) {}
