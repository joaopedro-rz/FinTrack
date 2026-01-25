package com.app.FinTrack.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro JWT que intercepta todas as requisições HTTP.
 * Captura exceções específicas para melhor monitoramento de segurança.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwt = extractJwtFromRequest(request);

        if (StringUtils.hasText(jwt)) {
            try {
                if (jwtService.validateToken(jwt)) {
                    authenticateUser(jwt, request);
                }
            } catch (ExpiredJwtException ex) {
                log.warn("Token JWT expirado para requisição: {}", request.getRequestURI());
            } catch (SignatureException ex) {
                log.warn("Assinatura JWT inválida - possível tentativa de adulteração: {}", request.getRequestURI());
            } catch (MalformedJwtException ex) {
                log.warn("Token JWT malformado: {}", request.getRequestURI());
            } catch (UnsupportedJwtException ex) {
                log.warn("Token JWT não suportado: {}", request.getRequestURI());
            } catch (UsernameNotFoundException ex) {
                log.warn("Usuário do token não encontrado no banco: {}", ex.getMessage());
            } catch (IllegalArgumentException ex) {
                log.warn("JWT claims vazio ou inválido: {}", request.getRequestURI());
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateUser(String jwt, HttpServletRequest request) {
        String email = jwtService.getEmailFromToken(jwt);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("Usuário autenticado via JWT: {}", email);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
