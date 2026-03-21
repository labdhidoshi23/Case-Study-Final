package com.user.user_service.dto;

import com.user.user_service.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class UserDto {

    @Data
    public static class RegisterRequest {
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @NotBlank private String password;
        private User.Role role = User.Role.CUSTOMER;
        private String phone;
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private UserResponse user;

        public AuthResponse(String token, UserResponse user) {
            this.token = token;
            this.user = user;
        }
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private User.Role role;
        private String phone;

        public static UserResponse from(User user) {
            UserResponse r = new UserResponse();
            r.id = user.getId();
            r.name = user.getName();
            r.email = user.getEmail();
            r.role = user.getRole();
            r.phone = user.getPhone();
            return r;
        }
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String phone;
        private User.Role role;
    }
}
