package com.example.lab5.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static java.time.LocalDateTime.now;
import static java.util.Optional.ofNullable;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    private final JwtProperties jwtProperties;

    private SecretKey secretKey;
    private JwtParser jwtParser;

    @PostConstruct
    private void init() {
        var keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        secretKey = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parser().verifyWith(secretKey).build();
    }

    public Optional<String> extractUsername(String token) {
        return ofNullable(parseToken(token))
                .map(Claims::getSubject);
    }

    public String generateToken(UserDetails userDetails) {
        return createToken(new HashMap<>(), userDetails);
    }

    private String createToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(getExpirationDateForToken(jwtProperties.getAccessExpireTime()))
                .signWith(secretKey).compact();
    }

    private Date getExpirationDateForToken(Long secondsToExpire) {
        return Date.from(now().plusSeconds(secondsToExpire).toInstant(ZoneOffset.UTC));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(parseToken(token));
    }

    private Claims parseToken(String token) {
        try {
            return jwtParser.parseSignedClaims(token).getPayload();
        } catch (JwtException exception) {
            return null;
        }
    }

}
