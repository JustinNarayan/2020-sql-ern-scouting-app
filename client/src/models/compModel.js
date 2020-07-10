import { action, thunk } from "easy-peasy";
import axios from "axios";
import authHeader from "../utils/authHeader";
import { authCommand } from "../utils/checkAuth";

const url = "/api/comps/";

export default {
   // State
   comps: [],

   // Thunks
   getComps: thunk(async (actions) => {
      // Handle WS Call
      actions.setAuth("Checking");
      const res = await axios.get(url, authHeader);
      const comps = res.data;

      // Handle state control
      authCommand(actions, comps, () => {
         actions.setComps(comps);
      });
   }),
   addComp: thunk(async (actions, comp) => {
      // Handle WS Call
      actions.setAuth("Checking");
      const res = await axios.post(url, comp, authHeader);
      const out = res.data;

      // Call to getComps
      authCommand(actions, out, () => actions.getComps());

      // Return api response to display to user
      return out;
   }),
   editComp: thunk(async (actions, compEdit) => {
      // Handle WS Call
      actions.setAuth("Checking");
      const res = await axios.patch(
         `${url}${compEdit.id}`,
         compEdit,
         authHeader
      );
      const out = res.data;

      // Call to getComps
      authCommand(actions, out, () => actions.getComps());

      // Return api response to display to user
      return out;
   }),
   deleteComp: thunk(async (actions, id) => {
      // Handle WS Call
      actions.setAuth("Checking");
      const res = await axios.delete(`${url}${id}`, authHeader);
      const out = res.data;

      // Call to getComps
      authCommand(actions, out, () => actions.getComps());

      // Return api response to display to user
      return out;
   }),

   // actions
   setComps: action((state, comps) => {
      state.comps = comps;
   }),
};
