package com.app.FinTrack.security;

import com.app.FinTrack.domain.entity.User;
import com.app.FinTrack.repository.UserRepository;
import com.app.FinTrack.util.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalizedEmail = EmailUtils.normalize(email);
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado com email: " + email));
    }
}
