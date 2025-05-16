import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { discoverBackendServer } from "../Utils/ServerFinder";
import { ServiceLocatorContext } from "../Contexts/ServiceLocatorContext";
import { Navigate, useNavigate } from "react-router-dom";

const FindServiceScreen: React.FC = () => {
  const { ip, setIp, port, setPort, url } = useContext(ServiceLocatorContext)!;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log("in try");
      await discoverBackendServer(parseInt(port)).then((ip: string | null) => {
        if (ip) {
          console.log(`Found server at: ${ip}`);
          setIp(ip);
          setError(null);
          navigate("/drive");
        } else {
          setError("Error connecting to drive!");
        }
      });
    } catch (error) {
      setError(`${error}`);
    }

    setLoading(false);
    setAlert(true);
    // Handle port submission logic here
    console.log("Port submitted:", port);
  };

  console.log(url);
  if (url) return <Navigate to="/drive" />;
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Port"
        variant="outlined"
        type="number"
        value={port || 55551}
        onChange={(e) => setPort(e.target.value)}
        inputProps={{ min: "0", max: "65535" }}
        sx={{
          color: "white",
          input: { color: "#808080" },
          label: { color: "white" },
        }}
      />
      <Typography style={{ color: "#808080" }} variant="subtitle2" gutterBottom>
        (Leave as is unless told otherwise)
      </Typography>
      {alert ? (
        <Alert
          variant={"filled"}
          severity={!error ? "success" : "error"}
          onClose={(e) => {
            e.preventDefault();
            setAlert(false);
          }}
        >
          {!error
            ? "Connected to drive!"
            : `Error connecting to drive... ${error}`}
        </Alert>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Connect to drive
        </Button>
      )}
    </Box>
  );
};

export default FindServiceScreen;
