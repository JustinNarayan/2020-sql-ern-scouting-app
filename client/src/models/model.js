/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
const {
   appearsAdmin,
   login,
   register,
   verify,
   admin,
   setAppearsAdmin,
} = userModel;
const { comps, getComps, addComp, editComp, deleteComp, setComps } = compModel;

export default {
   // State
   appearsAdmin,
   comps,

   // Thunks
   login,
   register,
   verify,
   admin,
   getComps,
   addComp,
   editComp,
   deleteComp,

   // Actions
   setAppearsAdmin,
   setComps,
};
