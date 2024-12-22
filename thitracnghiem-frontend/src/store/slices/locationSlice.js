import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import locationService from "../../service/locationService.js";


// Thunk xử lý logic bất đồng bộ
export const fetchLocations = createAsyncThunk(
    "locations/fetchLocations",
    async () => {
        return await locationService.getAllLocations();
    }
);

export const createLocation = createAsyncThunk(
    "locations/createLocation",
    async (locationData, {rejectWithValue}) => {
        try {
            return await locationService.addLocation(locationData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const modifyLocation = createAsyncThunk(
    "locations/modifyLocation",
    async ({locationId, locationData}, {rejectWithValue}) => {
        try {
            return await locationService.updateLocation(locationId, locationData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeLocation = createAsyncThunk(
    "locations/removeLocation",
    async (locationId, {rejectWithValue}) => {
        try {
            return await locationService.deleteLocation(locationId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice quản lý state
const locationSlice = createSlice({
    name: "locations",
    initialState: {
        locations: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.locations = action.payload;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createLocation.fulfilled, (state, action) => {
                state.locations.push(action.payload);
            })
            .addCase(modifyLocation.fulfilled, (state, action) => {
                state.locations = state.locations.map((location) =>
                    location.locationId === action.payload.locationId
                        ? action.payload
                        : location
                );
            })
            .addCase(removeLocation.fulfilled, (state, action) => {
                state.locations = state.locations.filter(
                    (location) => location.locationId !== action.payload
                );
            });
    },
});

export default locationSlice.reducer;
