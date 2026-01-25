package com.app.FinTrack.util;

/**
 * Utilitário para operações comuns com email.
 * Centraliza a lógica de normalização para garantir consistência em toda a aplicação.
 */
public final class EmailUtils {

    private EmailUtils() {
        // Utility class - não deve ser instanciada
    }

    public static String normalize(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email não pode ser null");
        }

        String normalized = email.trim().toLowerCase();

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }

        return normalized;
    }

    public static String normalizeOrNull(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}
