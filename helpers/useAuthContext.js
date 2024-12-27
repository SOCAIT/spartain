import {AuthContext} from "./AuthContext";
//import { useContext } from "react";
const useAuthContext= () => {
//  console.log("useAuth")
  const {authState,setAuthState} = useContext(AuthContext);
//  if (authState === undefined) {
//  throw new Error("useAuthContext can only be used inside AuthProvider");
//  }
 return {authState, setAuthState};
};

export default useAuthContext;