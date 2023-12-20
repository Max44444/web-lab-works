package com.example.lab5.dto;

public record AuthenticationRequest (
        String email,
        String password
) {}
