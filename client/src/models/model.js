/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
//import dataModel from "./dataModel";
const { login, register, verify, appearAdmin } = userModel;
const {
   comps,
   getComps,
   getComp,
   addComp,
   editComp,
   deleteComp,
   setComps,
} = compModel;

export default {
   // State
   comps,

   // Thunks
   login,
   register,
   verify,
   appearAdmin,

   getComps,
   getComp,
   addComp,
   editComp,
   deleteComp,

   // Actions
   setComps,
};
