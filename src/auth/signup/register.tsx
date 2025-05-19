import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './register.css';
import { userSignup } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, ChangeEvent, useEffect } from "react";
import { RootState, AppDispatch } from "../../redux/store";

// import './r.css';
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
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
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const finalData = {
      ...data,
      image: imagePreview || "",
    };
    dispatch(userSignup(finalData)).unwrap();

    const profileData = {
      id: Date.now().toString(36),
      fullname: data.fullname,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      image: imagePreview,
    };

    localStorage.setItem("userProfile", JSON.stringify(profileData));
    reset();
    setImagePreview(null);
  };

  return (
    <Box
      className="signup-container"
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      minHeight="100vh"
      padding={{ xs: 1, sm: 2 }}
    >
      {/* Left Side - Image */}
      <Box
        className="signup-image-container"
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={{ xs: 2, md: 4 }}
        sx={{
          order: { xs: 1, md: 1 },
          mb: { xs: 2, md: 0 } // Responsive margin bottom
        }}
      >
        <img
          src="/images/sitting-beac-1.png"
          alt="Signup"
          className="signup-image"
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Right Side - Form */}
      <Box
        className="signup-box"
        flex={1}
        padding={{ xs: 3, sm: 4 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          order: { xs: 2, md: 2 }
        }}
      >
        <Box width="100%" maxWidth="500px">
          <Typography variant="h5" className="signup-title" mb={2}>
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
                pattern: {
                  value: /^\S+@\S+$/,
                  message: "Invalid email format",
                },
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

            <FormLabel sx={{ mt: 2 }}>Gender</FormLabel>
            <RadioGroup row defaultValue="male">
              <FormControlLabel
                value="male"
                control={<Radio {...register("gender")} />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio {...register("gender")} />}
                label="Female"
              />
            </RadioGroup>

            <TextField
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
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
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
              <Button
                variant="contained"
                color="primary"
                component="span"
                sx={{ mt: 2 }}
                fullWidth
              >
                Upload Image
              </Button>
            </label>

            {imageError && (
              <Typography color="error" mt={1}>
                {imageError}
              </Typography>
            )}

            {imagePreview && (
              <Box mt={2} textAlign="center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: 'auto',
                    borderRadius: "4px",
                    maxWidth: "100%"
                  }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="signup-button"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress color="inherit" size={24} /> : "Signup"}
            </Button>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                Registration successful!
              </Alert>
            </Snackbar>
          </form>

          {isError && (
            <Typography color="error" textAlign="center" mt={2}>
              {isError}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}


// import { useForm, SubmitHandler } from "react-hook-form";
// import { TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel, FormLabel, CircularProgress, } from "@mui/material";
// import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

// import './register.css';


// import { userSignup } from "../../redux/authSlice";

// import { useDispatch, useSelector } from "react-redux";
// import { useState, ChangeEvent, useEffect } from "react";
// import { RootState, AppDispatch } from "../../redux/store"; // Adjust if your store file is named differently

// interface FormInputs {
//   fullname: string;
//   email: string;
//   phone: string;
//   gender: string;
//   password: string;
//   confirmPassword: string;
//   image: File | null;
// }

// export default function Signup() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm<FormInputs>();

//   const dispatch = useDispatch<AppDispatch>();
//   const { isLoading, isError, isRegistered } = useSelector((state: RootState) => state.authKey);

//   const password = watch("password");

//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageError, setImageError] = useState<string>("");



//   // M-UI Alert MSG //
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const handleSnackbarClose = (
//     _event?: React.SyntheticEvent | Event,
//     reason?: SnackbarCloseReason
//   ) => {
//     if (reason === 'clickaway') return;
//     setSnackbarOpen(false);
//   };

//   useEffect(() => {
//     if (isRegistered) {
//       setSnackbarOpen(true);
//     }
//   }, [isRegistered]);


//   // Convert Image to Base64
//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!validTypes.includes(file.type)) {
//         setImageError("Only JPG, JPEG, and PNG files are allowed.");
//         setImagePreview(null);
//         setValue("image", null);

//         return;
//       }
//       setImageError("");
//       // setImagePreview(null);
//       setImagePreview(URL.createObjectURL(file));
//       setValue("image", file);

//     }
//   };


//   const onSubmit: SubmitHandler<FormInputs> = async (data) => {

//     // if (imagePreview) {
//     //   data.image = imagePreview;
//     // }

//     const finalData = {
//       ...data,
//       image: imagePreview || "",
//     };
//     dispatch(userSignup(finalData)).unwrap();

//     const profileData = {
//       id: Date.now().toString(36),
//       fullname: data.fullname,
//       gender: data.gender,
//       phone: data.phone,
//       email: data.email,
//       image: imagePreview,
//     };

//     localStorage.setItem("userProfile", JSON.stringify(profileData));

//     console.log("User Profile Data:", profileData);
//     console.log(data);
//     reset();
//     setImagePreview(null);
//     // window.location.reload();
//   };

//   return (
//     <Box
//       className="signup-container"
//       display="flex"
//       flexDirection={{ xs: "column", sm: "row" }}
//       height="100vh"
//     >
//       {/* Left Side - Image */}
//       <Box
//         className="signup-image-container"
//         flex={1}
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         // sx={{ backgroundColor: "#f5f5f5" }}
//       >
//         <img
//           src="/images/sitting-beac-1.png"
//           alt="Signup"
//           className="signup-image"
//           style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//         />
//       </Box>

//       {/* Right Side - Form */}
//       <Box
//         className="signup-box"
//         flex={1}
//         p={4}
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Box width="100%" maxWidth="500px">
//           <Typography variant="h5" className="signup-title" mb={2}>
//             Signup
//           </Typography>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <TextField
//               fullWidth
//               label="Full Name"
//               {...register("fullname", { required: "Full Name is required" })}
//               error={!!errors.fullname}
//               helperText={errors.fullname?.message}
//               margin="normal"
//             />
//             <TextField
//               fullWidth
//               label="Email"
//               type="email"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^\S+@\S+$/,
//                   message: "Invalid email format",
//                 },
//               })}
//               error={!!errors.email}
//               helperText={errors.email?.message}
//               margin="normal"
//             />
//             <TextField
//               fullWidth
//               label="Phone Number"
//               type="tel"
//               {...register("phone", { required: "Phone number is required" })}
//               error={!!errors.phone}
//               helperText={errors.phone?.message}
//               margin="normal"
//             />

//             <FormLabel sx={{ mt: 2 }}>Gender</FormLabel>
//             <RadioGroup row defaultValue="male">
//               <FormControlLabel
//                 value="male"
//                 control={<Radio {...register("gender")} />}
//                 label="Male"
//               />
//               <FormControlLabel
//                 value="female"
//                 control={<Radio {...register("gender")} />}
//                 label="Female"
//               />
//             </RadioGroup>

//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//               })}
//               error={!!errors.password}
//               helperText={errors.password?.message}
//               margin="normal"
//             />
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type="password"
//               {...register("confirmPassword", {
//                 required: "Confirm Password is required",
//                 validate: (value) =>
//                   value === password || "Passwords do not match",
//               })}
//               error={!!errors.confirmPassword}
//               helperText={errors.confirmPassword?.message}
//               margin="normal"
//             />

//             <input
//               type="file"
//               accept="image/jpeg, image/jpg, image/png"
//               {...register("image")}
//               style={{ display: "none" }}
//               id="image-upload"
//               onChange={handleImageUpload}
//             />
//             <label htmlFor="image-upload">
//               <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
//                 Upload Image
//               </Button>
//             </label>

//             {imageError && (
//               <Typography color="error" mt={1}>
//                 {imageError}
//               </Typography>
//             )}

//             {imagePreview && (
//               <Box mt={2}>
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   style={{ width: "100px", height: 'auto', borderRadius: "4px" }}
//                 />
//               </Box>
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               className="signup-button"
//               disabled={isLoading}
//               sx={{ mt: 3 }}
//             >
//               {isLoading ? <CircularProgress color="inherit" size={24} /> : "Signup"}
//             </Button>

//             <Snackbar
//               open={snackbarOpen}
//               autoHideDuration={6000}
//               onClose={handleSnackbarClose}
//               anchorOrigin={{ vertical: "top", horizontal: "center" }}
//             >
//               <Alert
//                 onClose={handleSnackbarClose}
//                 severity="success"
//                 variant="filled"
//                 sx={{ width: "100%" }}
//               >
//                 Registration successful!
//               </Alert>
//             </Snackbar>
//           </form>

//           {isError && <p style={{ color: "red" }}>{isError}</p>}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
