/// Model for all state actions
import userModel from "./userModel";
import compModel from "./compModel";
import pendingModel from "./pendingModel";
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
const {
   pending,
   getPending,
   addPending,
   switchPendingCompetition,
   deletePending,
   setPending,
} = pendingModel;
const { data, getData, addData, patchData, setData } = dataModel;

export default {
   // State
   comps,
   comp,
   pending,
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

   getPending,
   addPending,
   switchPendingCompetition,
   deletePending,

   getData,
   addData,
   patchData,

   // Actions
   setComps,
   setComp,
   setPending,
   setData,
};
