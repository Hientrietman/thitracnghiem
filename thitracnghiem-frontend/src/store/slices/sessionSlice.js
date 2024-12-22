import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import sessionService from "../../service/sessionService";

// Thunks
export const fetchSessions = createAsyncThunk("sessions/getSessions", async () => {
    return await sessionService.getAllSessions();
});

export const createSession = createAsyncThunk(
    "sessions/addSession",
    async (sessionData, {rejectWithValue}) => {
        try {
            return await sessionService.addSession(sessionData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const modifySession = createAsyncThunk(
    "sessions/updateSession",
    async ({sessionId, sessionData}, {rejectWithValue}) => {
        try {
            return await sessionService.updateSession(sessionId, sessionData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeSession = createAsyncThunk(
    "sessions/deleteSession",
    async (sessionId, {rejectWithValue}) => {
        try {
            return await sessionService.deleteSession(sessionId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const sessionSlice = createSlice({
    name: "sessions",
    initialState: {
        sessions: [],
        isLoading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // Fetch sessions
            .addCase(fetchSessions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = action.payload;
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })

            // Create session
            .addCase(createSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions.push(action.payload);
            })
            .addCase(createSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })

            // Modify session
            .addCase(modifySession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(modifySession.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.sessions.findIndex(
                    (session) => session.sessionId === action.payload.sessionId
                );
                if (index !== -1) {
                    state.sessions[index] = action.payload;
                }
            })
            .addCase(modifySession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })

            // Remove session
            .addCase(removeSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = state.sessions.filter(
                    (session) => session.sessionId !== action.payload
                );
            })
            .addCase(removeSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default sessionSlice.reducer;
