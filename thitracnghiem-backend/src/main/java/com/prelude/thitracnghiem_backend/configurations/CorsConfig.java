package com.prelude.thitracnghiem_backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép tất cả các endpoint từ localhost:5173
        registry.addMapping("/**") // Áp dụng cho tất cả các request
                .allowedOrigins("http://localhost:5173","http://localhost:3000","http://localhost:8081") // Cho phép yêu cầu từ localhost:5173
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Cho phép các phương thức HTTP này
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Cho phép gửi cookie hoặc header authorization nếu cần
    }
}
