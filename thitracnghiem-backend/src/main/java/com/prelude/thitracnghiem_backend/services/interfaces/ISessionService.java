package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.SessionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.SessionResponse;
import com.prelude.thitracnghiem_backend.models.Session;

import java.util.List;

public interface ISessionService {
    ResponseApi<List<SessionResponse>> getAllSessions();

    ResponseApi<SessionResponse> getSession(int sessionId);

    ResponseApi<Session> createSession(SessionRequest request);

    ResponseApi<SessionResponse> updateSession(int sessionId, SessionRequest request);

    ResponseApi<Void> deleteSession(int sessionId);
}
