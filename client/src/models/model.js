/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
import pendingModel from "./pendingModel";
import dataModel from "./dataModel";
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
const { addPending } = pendingModel;
const { addData } = dataModel;

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

   addPending,

   addData,

   // Actions
   setComps,
};
