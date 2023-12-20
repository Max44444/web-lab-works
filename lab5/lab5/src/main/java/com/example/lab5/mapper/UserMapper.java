package com.example.lab5.mapper;

import com.example.lab5.domain.User;
import com.example.lab5.domain.UserRole;
import com.example.lab5.dto.UserDataRequest;
import com.example.lab5.dto.UserDataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public User getUser(UserDataRequest request) {
        return User.builder()
                .username(request.email())
                .password(passwordEncoder.encode(request.password()))
                .authorities(Set.of(UserRole.USER))
                .name(request.name())
                .groupName(request.group())
                .phone(request.phone())
                .variant(request.variant())
                .build();
    }

    public UserDataResponse getUserData(User user) {
        return UserDataResponse.builder()
                .username(user.getUsername())
                .name(user.getName())
                .group(user.getGroupName())
                .phone(user.getPhone())
                .variant(user.getVariant())
                .build();
    }

    public void populateUserDetails(UserDataRequest request, User user) {
        user.setUsername(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setGroupName(request.group());
        user.setPhone(request.phone());
        user.setVariant(request.variant());
    }
}
