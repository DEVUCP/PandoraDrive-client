import { createHTTPClient } from "../Clients/HTTPClient";

export interface UserService {
  login: (data: { username: string; password: string }) => Promise<void>;
}

const UserLoginService = (
  backend_url: string,
  handle_error: (err: Error) => void,
) => {
  const gateway_client = createHTTPClient([
    (data) => {
      console.log(data);
      return data;
    },
  ]);

  const login = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    return gateway_client
      .post(
        `${backend_url}/api/v1/auth/login`,
        {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        formData,
      )
      .then((_) => console.log("hello"))
      .catch((err: Error) => {
        handle_error(err);
      });
  };
  return { login };
};
export default UserLoginService;
