import { useState, useContext, useEffect } from "react";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import UserLoginService from "../Services/UserLoginService";
import { ipContext } from "../Contexts/ipContext";
import { portContext } from "../Contexts/portContext";

const LoginForm: React.FC = () => {
  const { ip } = useContext(ipContext);
  const { port } = useContext(portContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const userService = UserLoginService(`http://localhost:${port}`, (err) =>
    console.log(err.message),
  );
  useEffect(() => {
    console.log(`locahost:${port}`);
  }, [ip, port]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (username && password) {
      await userService.login({ username, password });
    } else {
      setError("Both fields are required.");
    }
  };

  // Handle errors
  const handleError = (err: Error) => {
    console.error("Error:", err);
    setError("An error occurred while logging in.");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        {error && (
          <Typography
            color="error"
            variant="body2"
            align="center"
            sx={{ marginTop: 2 }}
          >
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
