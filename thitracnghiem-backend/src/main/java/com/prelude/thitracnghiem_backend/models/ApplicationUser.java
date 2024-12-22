package com.prelude.thitracnghiem_backend.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prelude.thitracnghiem_backend.models.HasRolePermission;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data
@NoArgsConstructor
@Table(name = "application_user")
public class ApplicationUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    private String userName;

    @JsonIgnore
    private String userPassword;

    @Column(unique = true)
    private String email;

    private String realName;
    private String phoneNumber;

    @Column(columnDefinition = "boolean default false")
    private boolean isActive;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp registrationDate;

    @Column(columnDefinition = "timestamp default current_timestamp")
    private Timestamp updateDate;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<HasRolePermission> hasRolePermissions = new ArrayList<>();

    @Override
    @JsonIgnore
    @Transactional
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Duyệt qua từng HasRolePermission mà người dùng có
        for (HasRolePermission hrp : hasRolePermissions) {
            // Thêm quyền vai trò vào danh sách authorities
            authorities.add(new SimpleGrantedAuthority("ROLE_" + hrp.getRole().getRoleName()));

            // Thêm quyền từ vai trò vào danh sách authorities
            authorities.add(new SimpleGrantedAuthority(hrp.getPermission().getPermissionName()));
        }

        return authorities;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    @Override
    public String getPassword() {
        return getUserPassword();
    }

    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return isActive;
    }



    // Các phương thức getter và setter khác
}
