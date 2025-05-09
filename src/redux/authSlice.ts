import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosError } from "axios";

// Define types for the user and state
interface User {
    id: number;
    fullname: string;
    email: string;
    password: string;
    phone: string
    gender: string;
    image: string | null;
    token: string;
}

interface AuthState {
    upload_status: string;
    isRegistered: boolean;
    isLoading: boolean;
    isError: string | null;
    redirectHome: boolean;
    redirectLogin: string | null;
    isLogin: boolean;
    Userdetails: User[];
    token?: string | null;
    email?: string | null;
    name?: string | null;
}

const Api_URL = 'http://localhost:5000/users';

const initialState: AuthState = {
    upload_status: "idle",
    isRegistered: false,
    isLoading: false,
    isError: null,
    redirectHome: !!localStorage.getItem("token"),
    redirectLogin: null,
    isLogin: !!localStorage.getItem("token"),
    Userdetails: [],
};

interface SignupData {
    fullname: string;
    email: string;
    phone: string | number;
    gender: string;
    password: string;
    confirmPassword: string;
    image: string | null;
}

// Async thunk for user signup
export const userSignup = createAsyncThunk<User, SignupData, { rejectValue: string }>(
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.get(Api_URL);
            const resData: User[] = res?.data;

            const emailexists = resData.some((checkemail) => checkemail.email === formData.email);
            if (emailexists) {
                throw new Error("Email already exists");
            }

            const userdata = await axios.post(Api_URL, formData);
            return userdata?.data;
        } catch (error) {
            // Type error as AxiosError for better handling
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data?.message || "Signup failed");
        }
    }
);

// Async thunk for user signin
export const userSignin = createAsyncThunk(
    'auth/signin',
    async (formData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await axios.get(Api_URL);
            const resUser: User[] = res?.data;

            const userFind = resUser.find((finduser) => finduser.email === formData.email && finduser.password === formData.password);
            if (!userFind) {
                throw new Error("Invalid email or password!");
            }

            const token = userFind.token || uuidv4();

            await axios.patch(`${Api_URL}/${userFind.id}`, { token });

            // Store token (simulating authentication)
            localStorage.setItem("token", token);
            localStorage.setItem("email", userFind.email);
            localStorage.setItem("name", userFind.fullname);

            return {
                email: userFind.email, token, isLogin: true, fullname: userFind.fullname,
                message: "Login successful"
            };
        } catch (error) {
            console.error(error);

            // Type error as AxiosError for better handling
            //   const axiosError = error as AxiosError;
            return rejectWithValue("Something went wrong during login.");
        }
    }
);

// Redux slice
export const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isLogin = true;
            state.Userdetails.push(action.payload);
        },
        handlelogout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            state.isLogin = false;
            state.token = null;
            state.email = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userSignup.pending, (state) => {
                state.upload_status = "loading...";
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(userSignup.fulfilled, (state, action: PayloadAction<User>) => {
                state.upload_status = "register successfully";
                state.isLoading = false;
                state.isRegistered = true;
                state.Userdetails.push(action.payload);
                localStorage.setItem("email", action.payload.email);
            })
            .addCase(userSignup.rejected, (state, action: PayloadAction<string>) => {
                state.upload_status = "failed to register";
                state.isLoading = false;
                state.isError = action.payload ?? "Unknown error";
            })
            // Login
            .addCase(userSignin.pending, (state) => {
                state.upload_status = "Logging in...";
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(userSignin.fulfilled, (state, action) => {
                state.upload_status = action.payload.message;
                state.isLoading = false;
                state.token = action.payload.token;
                state.email = action.payload.email;
                state.name = action.payload.fullname;
                state.isLogin = true;
            })
            .addCase(userSignin.rejected, (state, action: PayloadAction<string>) => {
                state.upload_status = "Login failed";
                state.isLoading = false;
                state.isError = action.payload ?? "Unknown error";
            });
    },
});

export const { loginSuccess, handlelogout } = authSlice.actions;
export default authSlice.reducer;
