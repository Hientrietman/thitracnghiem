    package com.prelude.thitracnghiem_backend.models;

    import com.prelude.thitracnghiem_backend.models.HasRolePermission;
    import jakarta.persistence.*;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.HashSet;
    import java.util.Set;

    @Entity
    @Data
    @NoArgsConstructor
    @Table(name = "permissions")
    public class Permission {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int permissionId;

        @Column(nullable = false, unique = true)
        private String permissionName;

        private String description;

        @OneToMany(mappedBy = "permission", fetch = FetchType.EAGER)
        private Set<HasRolePermission> hasRolePermissions = new HashSet<>();

        // Các phương thức khác...
    }
