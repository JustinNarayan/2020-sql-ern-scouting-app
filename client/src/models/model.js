/// Model for all state actions
import userModel from "./userModel";
const { auth, login } = userModel;

export default {
   // State
   auth,

   // Thunks
   login,
};
