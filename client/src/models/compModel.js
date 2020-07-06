import { action, thunk } from "easy-peasy";
import axios from "axios";
import authHeader from "./authHeader";
import { authStateChange } from "../checkAuth";

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
      authStateChange(actions, comps, () => {
         actions.setComps(comps);
      });
   }),

   // actions
   setComps: action((state, comps) => {
      state.comps = comps;
   }),
};
