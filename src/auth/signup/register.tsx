import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel, FormLabel, Grid, CircularProgress, } from "@mui/material";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import './register.css';

import { userSignup } from "../../redux/authSlice";

import { useDispatch, useSelector } from "react-redux";
import { useState, ChangeEvent, useEffect } from "react";
import { RootState, AppDispatch } from "../../redux/store"; // Adjust if your store file is named differently

interface FormInputs {
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
  image: File | null;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isError, isRegistered } = useSelector((state: RootState) => state.authKey);

  const password = watch("password");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");



  // M-UI Alert MSG //
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (isRegistered) {
      setSnackbarOpen(true);
    }
  }, [isRegistered]);


  // Convert Image to Base64
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setImageError("Only JPG, JPEG, and PNG files are allowed.");
        setImagePreview(null);
        setValue("image", null);

        return;
      }
      setImageError("");
      // setImagePreview(null);
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);

    }
  };


  const onSubmit: SubmitHandler<FormInputs> = async (data: any) => {

    if (imagePreview) {
      data.image = imagePreview;
    }

    dispatch(userSignup(data));

    const profileData = {
      id: Date.now().toString(36),
      fullname: data.fullname,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      image: imagePreview,
    };

    localStorage.setItem("userProfile", JSON.stringify(profileData));

    console.log("User Profile Data:", profileData);
    console.log(data);
    reset();
    setImagePreview(null);
    window.location.reload();
  };

  return (
    <Grid container className="signup-container">
      {/* Left Side - Image */}
      <Grid item xs={12} sm={6} className="signup-image-container">
        <img src={'SignupImage'} alt="Signup" className="signup-image" />
      </Grid>

      {/* Right Side - Form */}
      <Grid item xs={12} sm={6} className="signup-box">
        <Box component="div">
          <Typography variant="h5" className="signup-title">
            Signup
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              {...register("fullname", { required: "Full Name is required" })}
              error={!!errors.fullname}
              helperText={errors.fullname?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/, message: "Invalid email format" },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              margin="normal"
            />

            <FormLabel className="signup-gender-label">Gender</FormLabel>
            <RadioGroup row defaultValue="male">
              <FormControlLabel name="male" value="male" control={<Radio {...register("gender")} />} label="Male" />
              <FormControlLabel name="female" value="female" control={<Radio {...register("gender")} />} label="Female" />
            </RadioGroup>

            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              margin="normal"
            />

            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              {...register("image")}
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" color="primary" component="span">
                Upload Image
               
                
              </Button>
            </label>

            {imageError && <Typography color="error">{imageError}</Typography>}

            {/* Optional Preview */}
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth className="signup-button" disabled={isLoading}>
              {isLoading ? <CircularProgress color="inherit" /> : "Signup"}
            </Button>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                Registration successful!
              </Alert>
            </Snackbar>
          </form>

          {isError && <p style={{ color: "red" }}>{isError}</p>}
          {/* {isRegistered && <p style={{ color: "green" }}>Registration Successful!</p>} */}
        </Box>
      </Grid>
    </Grid>
  );
}
