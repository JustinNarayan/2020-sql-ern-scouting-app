/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
const { auth, login, register, verify, setAuth } = userModel;
const { comps, getComps, addComp, setComps } = compModel;

export default {
   // State
   auth,
   comps,

   // Thunks
   login,
   register,
   verify,
   getComps,
   addComp,

   // Actions
   setAuth,
   setComps,
};
