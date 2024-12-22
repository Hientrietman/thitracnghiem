package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.SessionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.SessionResponse;
import com.prelude.thitracnghiem_backend.models.Session;
import com.prelude.thitracnghiem_backend.services.implementation.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;

    @GetMapping("/all")
    public ResponseEntity<ResponseApi<List<SessionResponse>>> getSessions() {
        ResponseApi<List<SessionResponse>> response = sessionService.getAllSessions();
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ResponseApi<SessionResponse>> getSession(@PathVariable int sessionId) {
        ResponseApi<SessionResponse> response = sessionService.getSession(sessionId);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/")
    public ResponseEntity<ResponseApi<Session>> createSession(@RequestBody SessionRequest request) {
        ResponseApi<Session> response = sessionService.createSession(request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<ResponseApi<SessionResponse>> updateSession(@PathVariable int sessionId, @RequestBody SessionRequest request) {
        ResponseApi<SessionResponse> response = sessionService.updateSession(sessionId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ResponseApi<Void>> deleteSession(@PathVariable int sessionId) {
        ResponseApi<Void> response = sessionService.deleteSession(sessionId);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
