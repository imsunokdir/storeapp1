import React from "react";
import { CircularProgress, Button } from "@mui/material";

const LoadingButton = ({
  text = "Submit",
  loadingText = "Loading...",
  loading = false,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = true,
  variant = "contained",
  color = "primary",
  ...props
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      {...props}
      sx={{
        textTransform: "none",
        py: 1.2,
        fontWeight: 500,
        fontSize: "1rem",
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color="inherit" sx={{ marginRight: 1 }} />
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  );
};

export default LoadingButton;
