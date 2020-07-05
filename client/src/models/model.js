/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
const { login } = userModel;
const { comps, getComps, setComps } = compModel;

export default {
   // State
   comps,

   // Thunks
   login,
   getComps,

   // Actions
   setComps,
};
