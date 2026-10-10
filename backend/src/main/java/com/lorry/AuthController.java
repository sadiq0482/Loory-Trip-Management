package com.lorry;

import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
    public AuthController(UserRepository users) { this.users = users; }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User in) {
        if (blank(in.name) || blank(in.phone) || in.password == null || in.password.length() < 4)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter name, phone and a password (4+ characters)");
        if (users.findByPhone(in.phone).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This phone is already registered");
        in.id = null;
        in.password = enc.encode(in.password);
        in.token = UUID.randomUUID().toString();
        users.save(in);
        return Map.of("token", in.token, "name", in.name);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User in) {
        var u = users.findByPhone(String.valueOf(in.phone)).orElse(null);
        if (u == null || in.password == null || !enc.matches(in.password, u.password))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Wrong phone or password");
        u.token = UUID.randomUUID().toString();
        users.save(u);
        return Map.of("token", u.token, "name", u.name);
    }

    private boolean blank(String s) { return s == null || s.isBlank(); }
}
