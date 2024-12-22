import sessionRepo from "../api/sessionRepo";
import SessionModel from "../model/SessionModel.js";

const sessionService = {
    getAllSessions: async () => {
        const data = await sessionRepo.getAll();
        return data.map((item) => SessionModel.fromApiResponse(item));
    },
    addSession: async (sessionData) => {
        const newSession = await sessionRepo.add(sessionData);
        return SessionModel.fromApiResponse(newSession);
    },
    updateSession: async (id, sessionData) => {
        const updatedSession = await sessionRepo.update(id, sessionData);
        return SessionModel.fromApiResponse(updatedSession);
    },
    deleteSession: async (id) => {
        return await sessionRepo.delete(id);
    },
};

export default sessionService;
