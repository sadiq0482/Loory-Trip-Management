package com.lorry;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Checks the login token on every /api/trips request and stores the user id. */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final UserRepository users;
    public WebConfig(UserRepository users) { this.users = users; }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object h) throws Exception {
                String t = String.valueOf(req.getHeader("Authorization")).replace("Bearer ", "");
                var u = users.findByToken(t);
                if (u.isEmpty()) { res.sendError(401, "Please log in again"); return false; }
                req.setAttribute("uid", u.get().id);
                return true;
            }
        }).addPathPatterns("/api/trips/**");
    }
}
