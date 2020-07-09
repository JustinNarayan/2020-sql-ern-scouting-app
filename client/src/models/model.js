/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
const { auth, login, register, verify, setAuth } = userModel;
const { comps, getComps, addComp, editComp, deleteComp, setComps } = compModel;

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
   editComp,
   deleteComp,

   // Actions
   setAuth,
   setComps,
};
