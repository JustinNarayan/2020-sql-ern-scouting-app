/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
const { login, register, verify } = userModel;
const { comps, getComps, setComps } = compModel;

export default {
   // State
   comps,

   // Thunks
   login,
   register,
   verify,
   getComps,

   // Actions
   setComps,
};
