/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
import dataModel from "./dataModel";
const { login, register, verify, appearAdmin } = userModel;
const {
   comps,
   comp,
   getComps,
   getComp,
   addComp,
   editComp,
   deleteComp,
   setComps,
   setComp,
} = compModel;
const { data, getData, addData, patchData, deleteData, setData } = dataModel;

export default {
   // State
   comps,
   comp,
   data,

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

   getData,
   addData,
   patchData,
   deleteData,

   // Actions
   setComps,
   setComp,
   setData,
};
