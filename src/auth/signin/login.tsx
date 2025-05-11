import { Typography, TextField, Button, Grid, Box, CircularProgress, } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
        control,
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
        <Grid container className="login-container">
            {/* Left Side - Image */}
            <Grid item xs={12} md={6} className="login-image-container">
                <img
                    src={"/assets/login-image.jpg"}
                    alt="Login"
                    className="login-image"
                />
            </Grid>

            {/* Right Side - Form */}
            <Grid item xs={12} md={6} className="login-box">
                <Typography variant="h5" className="login-title">
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}

                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/,
                                message: "Invalid email format",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/,
                                        message: "Invalid email format",
                                    },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                margin="normal"
                            />
                        )}
                    />

                    {/* Password */}
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                margin="normal"
                            />
                        )}
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
            </Grid>
        </Grid>
    );
}
