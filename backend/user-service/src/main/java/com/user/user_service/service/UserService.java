package com.user.user_service.service;

import com.user.user_service.dto.UserDto;
import com.user.user_service.entity.User;
import com.user.user_service.repository.UserRepository;
import com.user.user_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserDto.AuthResponse register(UserDto.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setPhone(req.getPhone());
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new UserDto.AuthResponse(token, UserDto.UserResponse.from(user));
    }

    public UserDto.AuthResponse login(UserDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new UserDto.AuthResponse(token, UserDto.UserResponse.from(user));
    }

    public List<UserDto.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto.UserResponse::from)
                .collect(Collectors.toList());
    }

    public UserDto.UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDto.UserResponse::from)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDto.UserResponse updateUser(Long id, UserDto.UpdateRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getRole() != null) user.setRole(req.getRole());
        return UserDto.UserResponse.from(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new RuntimeException("User not found");
        userRepository.deleteById(id);
    }

    public UserDto.UserResponse getProfile(String email) {
        return userRepository.findByEmail(email)
                .map(UserDto.UserResponse::from)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
