import {createSlice} from '@reduxjs/toolkit';
import { updateUser } from '../../../../server/controllers/user.controller';

const initialState = {
    Currentuser: null,
    loading: false,
    error: false,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.Currentuser = action.payload;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.Currentuser = action.payload;
            state.error = false;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});
export const {signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure} = userSlice.actions;
export default userSlice.reducer;
