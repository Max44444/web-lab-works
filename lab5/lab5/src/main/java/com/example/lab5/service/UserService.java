package com.example.lab5.service;

import com.example.lab5.config.jwt.JwtUtils;
import com.example.lab5.domain.UserRole;
import com.example.lab5.dto.AuthenticationRequest;
import com.example.lab5.dto.UserDataRequest;
import com.example.lab5.dto.UserDataResponse;
import com.example.lab5.exception.UserAlreadyExistsException;
import com.example.lab5.mapper.UserMapper;
import com.example.lab5.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserDataResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::getUserData).toList();
    }

    public String login(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.email());
        if (passwordEncoder.matches(request.password(), user.getPassword())) {
            return jwtUtils.generateToken(user);
        }
        throw new BadCredentialsException("The user credentials are wrong");
    }

    public String register(UserDataRequest request) {
        if (isUserCreated(request.email())) {
            throw new UserAlreadyExistsException("User with username " + request.email() + " are already exists");
        }
        return jwtUtils.generateToken(userRepository.save(userMapper.getUser(request)));
    }

    public UserDataResponse updateUser(UserDataRequest request) {
        var user = userRepository.findByUsername(request.email());
        if (isNull(user)) {
            throw new UserAlreadyExistsException("User with username " + request.email() + " is not exists");
        }
        userMapper.populateUserDetails(request, user);
        userRepository.save(user);
        return userMapper.getUserData(user);
    }

    public void deleteUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        deleteUser(username);
    }

    public void deleteUser(String username) {
        var user = userRepository.findByUsername(username);
        if (nonNull(user)) {
            userRepository.deleteById(user.getId());
        }
    }

    public UserDataResponse getUserData() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userMapper.getUserData(userRepository.findByUsername(username));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }

    public List<String> getUserRoles() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .getAuthorities().stream()
                .map(UserRole::toString)
                .toList();
    }

    private boolean isUserCreated(String username) {
        return nonNull(userRepository.findByUsername(username));
    }
}
