import { useContext } from "react";
import UserContext from "../contexts/UserContexts/UserContexts";

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
