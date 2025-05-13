import Cookies from "js-cookie";

export interface UserDataService {
  is_authenticated: () => boolean;
}
const UserDataService = () => {
  const is_authenticated = () => {
    return !!Cookies.get("session"); // Returns `true` if cookie exists
  };
  return { is_authenticated };
};
export default UserDataService;
