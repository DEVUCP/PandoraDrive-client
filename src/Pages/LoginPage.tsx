import { useState, useContext, useEffect } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import UserLoginService from '../Services/UserLoginService'
import { AuthContext } from '../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ServiceLocatorContext } from '../Contexts/ServiceLocatorContext'

const LoginForm: React.FC = () => {
  const { url } = useContext(ServiceLocatorContext)
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext)!

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const userService = UserLoginService(
    url,
    () => setIsAuthenticated(true),
    (err) => {
      console.log(err)
    }
  )

  const searchParams = new URLSearchParams(location.search)
  const redirectPath = searchParams.get('redirect') || '/drive'

  useEffect(() => {
    if (isAuthenticated) navigate(redirectPath)
  }, [isAuthenticated])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (username && password) {
      await userService.login({ username, password })
    } else {
      setError('Both fields are required.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
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
  )
}

export default LoginForm
