import { action, thunk } from "easy-peasy";
import axios from "axios";
import auth from "./auth";

const url = "/api/comps/";

export default {
   // State
   comps: [],

   // Thunks
   getComps: thunk(async (actions) => {
      // Handle WS Call
      const res = await axios.get(url, auth);
      const comps = res.data;

      // Handle state control
      actions.setComps(comps);
   }),

   // actions
   setComps: action((state, comps) => {
      state.comps = comps;
   }),
};
