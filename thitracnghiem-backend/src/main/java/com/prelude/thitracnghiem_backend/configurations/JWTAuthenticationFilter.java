package com.prelude.thitracnghiem_backend.configurations;

import com.prelude.thitracnghiem_backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtservice; // Service xử lý JWT
    private final UserDetailsService userDetailsService; // Service lấy thông tin người dùng từ database

    /**
     * Phương thức lọc yêu cầu HTTP để kiểm tra tính hợp lệ của token JWT và xác thực người dùng.
     * @param request Đối tượng HttpServletRequest chứa thông tin yêu cầu.
     * @param response Đối tượng HttpServletResponse dùng để trả về kết quả.
     * @param filterChain Chuỗi các bộ lọc tiếp theo trong chuỗi xử lý.
     * @throws ServletException Ngoại lệ nếu có lỗi trong việc xử lý yêu cầu.
     * @throws IOException Ngoại lệ nếu có lỗi trong việc xử lý đầu vào/đầu ra.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy header Authorization từ yêu cầu
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken; // Token JWT sẽ được lấy từ header
        final String username; // Tên người dùng được lấy từ token

        // Kiểm tra nếu header không chứa Authorization hoặc không phải kiểu Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Tiếp tục chuỗi lọc nếu không có token
            return;
        }

        // Lấy token từ header Authorization (cắt bỏ phần "Bearer ")
        jwtToken = authHeader.substring(7);
        // Lấy tên người dùng từ token
        username = jwtservice.getUsernameFromToken(jwtToken);

        // Nếu tên người dùng không rỗng và chưa có thông tin xác thực trong SecurityContext
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Tải thông tin người dùng từ UserDetailsService
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Kiểm tra tính hợp lệ của token với người dùng
            if (jwtservice.validateToken(jwtToken, userDetails)) {
                // Tạo đối tượng Authentication với thông tin người dùng
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken
                                (userDetails, null, userDetails.getAuthorities());

                // Cung cấp chi tiết xác thực cho đối tượng Authentication
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Đặt Authentication vào SecurityContextHolder
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

            // Tiếp tục chuỗi lọc
            filterChain.doFilter(request, response);
        }
    }
}
