package com.prelude.thitracnghiem_backend.utils;

import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

public class SecurityUtils {
    public static ApplicationUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authentication found");
        }
        return (ApplicationUser) authentication.getPrincipal();
    }
}
