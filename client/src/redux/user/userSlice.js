import {createSlice} from '@reduxjs/toolkit';

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
    },
});
export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;
export default userSlice.reducer;
