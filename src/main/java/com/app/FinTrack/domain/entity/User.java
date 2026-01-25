package com.app.FinTrack.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade JPA que representa um usuário do sistema FinTrack.
 * Esta classe mapeia diretamente para a tabela 'users' criada pela migration V1.
 *
 * SEGURANÇA:
 * - A senha será criptografada com BCrypt (quando implementarmos Spring Security)
 * - UUID garante IDs únicos e difíceis de enumerar
 *
 * LOMBOK:
 * - @Getter/@Setter: Gera getters e setters automaticamente
 * - @NoArgsConstructor: Construtor vazio (obrigatório para JPA)
 * - @AllArgsConstructor: Construtor com todos os campos
 * - @Builder: Padrão Builder para criar instâncias de forma fluente
 * - @EqualsAndHashCode: Gera equals() e hashCode() baseados apenas no ID
 *
 * POR QUE NÃO USAR @Data?
 * - @Data gera equals/hashCode com TODOS os campos
 * - Em entidades JPA com relacionamentos, isso causa loops infinitos
 * - Preferimos controlar manualmente quais campos usar
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public boolean isNew() {
        return this.id == null;
    }

    @PrePersist
    void prePersist() {
        normalizeEmail();
    }

    @PreUpdate
    void preUpdate() {
        normalizeEmail();
    }

    private void normalizeEmail() {
        if (this.email != null) {
            this.email = this.email.trim().toLowerCase();
        }
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
