package com.example.lab5.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserDataResponse {
    private String username;
    private String name;
    private String group;
    private String variant;
    private String phone;
}
