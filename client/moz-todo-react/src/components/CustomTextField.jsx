import TextField from "@mui/material/TextField";

const CustomTextField = ({ ...props }) => {
  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px", 
          backgroundColor: "#fff", 
          "&:hover fieldset": {
            borderColor: "#000000", 
          },
          "&.Mui-focused fieldset": {
            borderColor: "#000000", 
            borderWidth: "2px",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#000000", 
          fontWeight: "500",
        },
        "& .MuiInputBase-input": {
          fontSize: "1rem",
          fontWeight: "400",
        },
      }}
    />
  );
};

export default CustomTextField;
