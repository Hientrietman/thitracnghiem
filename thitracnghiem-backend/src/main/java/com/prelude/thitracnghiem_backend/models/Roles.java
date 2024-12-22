package com.prelude.thitracnghiem_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Data
@NoArgsConstructor
@Table(name = "roles")
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roleId;

    @Column(nullable = false, unique = true)
    private String roleName;

    private String description;

    @OneToMany(mappedBy = "role", fetch = FetchType.EAGER)
    private Set<HasRolePermission> hasRolePermissions = new HashSet<>();

    // Phương thức để lấy danh sách quyền
    public Set<Permission> getDefaultPermissions() {
        return hasRolePermissions.stream()
                .map(HasRolePermission::getPermission)
                .collect(Collectors.toSet());
    }
    public Roles(String roleName) {
        this.roleName = roleName;
    }
    // Các phương thức khác...
}
