import { action, thunk } from "easy-peasy";
import axios from "axios";
import authHeader from "./authHeader";
import { authCommand } from "../checkAuth";

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
   }),

   // actions
   setComps: action((state, comps) => {
      state.comps = comps;
   }),
};
