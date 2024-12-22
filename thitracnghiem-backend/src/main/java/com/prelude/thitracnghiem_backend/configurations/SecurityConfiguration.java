package com.prelude.thitracnghiem_backend.configurations;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final CustomUserDetailService customUserDetailService; // Service quản lý thông tin người dùng
    private final JWTAuthenticationFilter jwtAuthenticationFilter; // Bộ lọc xác thực JWT

    /**
     * Cấu hình bảo mật cho các endpoint HTTP.
     * @param http Đối tượng HttpSecurity dùng để cấu hình bảo mật.
     * @return SecurityFilterChain đối tượng bảo mật đã được cấu hình.
     * @throws Exception Ngoại lệ khi có lỗi trong quá trình cấu hình bảo mật.
     */
    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable) // Tắt CSRF (Cross-Site Request Forgery) cho API REST
                .cors(Customizer.withDefaults()) // Kích hoạt CORS (Cross-Origin Resource Sharing)
                .authorizeRequests(request -> request
                        .requestMatchers("/api/v1/auth/**").permitAll() // Cho phép tất cả các yêu cầu đến /api/v1/auth/** mà không cần xác thực
                        .requestMatchers("/TEST/authenticate","api/v1/admin/**").hasAnyRole("ADMIN","EXAM_COMMITTEE")


                        .anyRequest().authenticated()) // Yêu cầu xác thực cho tất cả các yêu cầu khác

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sử dụng chế độ Stateless cho phiên làm việc
                .authenticationProvider(authenticationProvider()) // Cung cấp AuthenticationProvider để xác thực người dùng
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Thêm bộ lọc JWT trước khi kiểm tra UsernamePasswordAuthenticationFilter

        return http.build(); // Trả về cấu hình SecurityFilterChain
    }

    /**
     * Cung cấp PasswordEncoder cho Spring Security.
     * @return PasswordEncoder để mã hóa mật khẩu.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        // Định nghĩa các encoder cho các thuật toán mã hóa mật khẩu
        encoders.put("bcrypt", new BCryptPasswordEncoder()); // BCrypt là thuật toán mã hóa mật khẩu mặc định
        encoders.put("argon2", new Argon2PasswordEncoder(16, 32, 1, 1 << 12, 3)); // Argon2 là một thuật toán mã hóa mật khẩu khác
        encoders.put("noop", NoOpPasswordEncoder.getInstance()); // NoOpPasswordEncoder không mã hóa mật khẩu (dùng cho mục đích test)

        return new DelegatingPasswordEncoder("bcrypt", encoders); // Trả về một PasswordEncoder sử dụng DelegatingPasswordEncoder
    }

    /**
     * Cung cấp AuthenticationProvider để xác thực người dùng.
     * @return DaoAuthenticationProvider cho phép xác thực người dùng từ cơ sở dữ liệu.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setPasswordEncoder(passwordEncoder()); // Đặt PasswordEncoder cho Provider
        authProvider.setUserDetailsService(customUserDetailService); // Đặt UserDetailsService cho Provider
        return authProvider;
    }

    /**
     * Cung cấp AuthenticationManager từ AuthenticationConfiguration để sử dụng trong ứng dụng.
     * @param authenticationConfiguration Đối tượng AuthenticationConfiguration để lấy AuthenticationManager.
     * @return AuthenticationManager đã cấu hình.
     * @throws Exception Ngoại lệ khi có lỗi trong việc lấy AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager(); // Trả về AuthenticationManager từ cấu hình hiện tại
    }
}
