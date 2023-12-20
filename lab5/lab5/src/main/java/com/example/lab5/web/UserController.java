package com.example.lab5.web;

import com.example.lab5.dto.AuthenticationRequest;
import com.example.lab5.dto.JwtAuthenticationResponse;
import com.example.lab5.dto.UserDataRequest;
import com.example.lab5.dto.UserDataResponse;
import com.example.lab5.exception.UserAlreadyExistsException;
import com.example.lab5.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("login")
    public JwtAuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        return new JwtAuthenticationResponse(userService.login(request));
    }

    @PostMapping("register")
    @ResponseStatus(HttpStatus.CREATED)
    public JwtAuthenticationResponse register(@RequestBody UserDataRequest request) {
        return new JwtAuthenticationResponse(userService.register(request));
    }

    @PutMapping("update")
    public UserDataResponse updateUserInfo(@RequestBody UserDataRequest request) {
        return userService.updateUser(request);
    }

    @DeleteMapping("delete/user")
    public void deleteUser(@RequestParam String username) {
        userService.deleteUser(username);
    }

    @DeleteMapping("delete")
    public void deleteMe() {
        userService.deleteUser();
    }

    @GetMapping("me")
    public UserDataResponse me() {
        return userService.getUserData();
    }

    @GetMapping("requestall")
    public List<UserDataResponse> users() {
        return userService.getAllUsers();
    }

    @GetMapping("role")
    public List<String> getUserRole() {
        return userService.getUserRoles();
    }

    @ExceptionHandler({BadCredentialsException.class, UserAlreadyExistsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleBadCredentialsException(BadCredentialsException exception) {
        log.error(exception.getMessage());
    }
}
