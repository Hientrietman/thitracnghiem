package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.SessionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.SessionResponse;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.SessionNotFoundException;
import com.prelude.thitracnghiem_backend.models.Session;
import com.prelude.thitracnghiem_backend.repositories.SessionRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.ISessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService implements ISessionService {
    private final SessionRepository sessionRepository;

    @Override
    public ResponseApi<List<SessionResponse>> getAllSessions() {
        List<Session> sessions = sessionRepository.findAll();
        List<SessionResponse> response = sessions.stream().map(session -> {
            SessionResponse sessionRes = new SessionResponse();
            sessionRes.setSessionId(session.getSessionId());
            sessionRes.setSessionName(session.getSessionName());
            sessionRes.setStartTime(session.getStartTime());
            return sessionRes;
        }).collect(Collectors.toList());

        return new ResponseApi<>(HttpStatus.OK, "Sessions retrieved successfully", response, true);
    }

    @Override
    public ResponseApi<SessionResponse> getSession(int sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found", sessionId));

        SessionResponse response = new SessionResponse();
        response.setSessionId(session.getSessionId());
        response.setSessionName(session.getSessionName());
        response.setStartTime(session.getStartTime());

        return new ResponseApi<>(HttpStatus.OK, "Session retrieved successfully", response, true);
    }

    @Override
    public ResponseApi<Session> createSession(SessionRequest request) {
        Session session = new Session();
        session.setSessionName(request.getSessionName());
        session.setStartTime(request.getStartTime());

        Session savedSession = sessionRepository.save(session);
        return new ResponseApi<>(HttpStatus.CREATED, "Session created successfully", savedSession, true);
    }

    @Override
    public ResponseApi<SessionResponse> updateSession(int sessionId, SessionRequest request) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found", sessionId));

        session.setSessionName(request.getSessionName());
        session.setStartTime(request.getStartTime());

        Session updatedSession = sessionRepository.save(session);

        SessionResponse response = new SessionResponse();
        response.setSessionId(updatedSession.getSessionId());
        response.setSessionName(updatedSession.getSessionName());
        response.setStartTime(updatedSession.getStartTime());

        return new ResponseApi<>(HttpStatus.OK, "Session updated successfully", response, true);
    }

    @Override
    public ResponseApi<Void> deleteSession(int sessionId) {
        sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found", sessionId));
        sessionRepository.deleteById(sessionId);
        return new ResponseApi<>(HttpStatus.OK, "Session deleted successfully", null, true);
    }
}
