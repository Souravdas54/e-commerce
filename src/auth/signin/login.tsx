import { Typography, TextField, Button, Box, CircularProgress, } from "@mui/material";

import { useForm, SubmitHandler } from "react-hook-form";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { userSignin } from "../../redux/authSlice";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../../redux/store";

// ✅ Define input types
type SigninFormInputs = {
    email: string;
    password: string;
};

export default function Signin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninFormInputs>();

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, isError, isLogin } = useSelector(
        (state: RootState) => state.authKey
    );

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<SigninFormInputs> = (data) => {
        dispatch(userSignin(data));
        console.log("Login Data:", data);
    };

    useEffect(() => {
        if (isLogin) {
            navigate("/");
        }
    }, [isLogin, navigate]);

    return (
        <Box className="login-container" display="flex" flexDirection={{ xs: "column", md: "row" }}>
            {/* Left Side - Image */}
            <Box className="login-image-container" flex={1}>
                <img
                    src="/assets/login-image.jpg"
                    alt="Login"
                    className="login-image"
                />
            </Box>

            {/* Right Side - Form */}
            <Box className="login-box" flex={1} p={4}>
                <Typography variant="h5" className="login-title">
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <TextField
                        label="Email"
                        fullWidth
                        type="email"
                        margin="normal"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/,
                                message: "Invalid email format",
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        fullWidth
                        type="password"
                        margin="normal"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="login-button"
                        disabled={isLoading}
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? <CircularProgress color="inherit" size={24} /> : "Login"}
                    </Button>

                    <Box sx={{ mt: 5 }}>
                        <Typography>
                            Don&apos;t have an account?{" "}
                            <RouterLink to="/signup">
                                <span>Sign up</span>
                            </RouterLink>
                        </Typography>
                    </Box>
                </form>

                {isError && <p style={{ color: "red" }}>{String(isError)}</p>}
                {isLogin && <p style={{ color: "green" }}>Login Successful</p>}
            </Box>
        </Box>
    );
}
