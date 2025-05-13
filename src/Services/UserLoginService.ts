import { createHTTPClient } from "../Clients/HTTPClient";
import Cookies from "js-cookie";

export interface UserService {
  login: (data: { username: string; password: string }) => void;
}

const UserLoginService = (
  backend_url: URL,
  handle_error: (err: Error) => void,
) => {
  const gateway_client = createHTTPClient();

  const login = (data: {
    username: string;
    password: string;
  }): Promise<void> => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    return gateway_client
      .post(
        `${backend_url}/api/v1/auth/login`,
        {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        formData,
      )
      .then((_) => console.log("hello"))
      .catch((err: Error) => handle_error(err));
  };
  return { login };
};
export default UserLoginService;
