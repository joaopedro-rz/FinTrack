package com.app.FinTrack.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

/**
 * Serviço responsável por geração e validação de tokens JWT.
 *
 * JWT (JSON Web Token) é composto por 3 partes:
 * 1. Header: algoritmo de assinatura (HS256)
 * 2. Payload: dados do usuário (claims)
 * 3. Signature: assinatura para validar integridade
 *
 * Formato: xxxxx.yyyyy.zzzzz
 *
 * SEGURANÇA:
 * - A propriedade jwt.secret é OBRIGATÓRIA e deve ter pelo menos 32 caracteres
 * - Em produção, use uma chave gerada com: openssl rand -base64 32
 */
@Service
@Slf4j
public class JwtService {

    private static final String DEV_SECRET_PREFIX = "fintrack-dev-secret";
    private static final int MIN_SECRET_LENGTH = 32;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    /**
     * Valida a configuração JWT na inicialização.
     * Alerta se usando secret de desenvolvimento.
     */
    @PostConstruct
    public void validateConfiguration() {
        if (jwtSecret.length() < MIN_SECRET_LENGTH) {
            throw new IllegalStateException(
                "JWT secret deve ter pelo menos " + MIN_SECRET_LENGTH + " caracteres para segurança adequada"
            );
        }

        if (jwtSecret.startsWith(DEV_SECRET_PREFIX)) {
            log.warn("===========================================");
            log.warn("⚠️  ATENÇÃO: Usando JWT secret de DESENVOLVIMENTO!");
            log.warn("⚠️  NÃO use em produção!");
            log.warn("⚠️  Para produção, defina: export JWT_SECRET=$(openssl rand -base64 32)");
            log.warn("===========================================");
        } else {
            log.info("✅ JWT configurado com secret personalizado");
        }

        log.info("JWT expiração: {} segundos ({} horas)",
            jwtExpiration / 1000,
            jwtExpiration / 3600000);
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(UUID userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId.toString())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    public UUID getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        String userIdStr = claims.get("userId", String.class);
        return UUID.fromString(userIdStr);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SignatureException ex) {
            log.error("Assinatura JWT inválida: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Token JWT malformado: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Token JWT expirado: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Token JWT não suportado: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string está vazia: {}", ex.getMessage());
        }
        return false;
    }

    public long getExpirationInSeconds() {
        return jwtExpiration / 1000;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
