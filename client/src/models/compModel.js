import { action, thunk } from "easy-peasy";
import axios from "axios";

const url = "/api/comps/";

export default {
   // State
   comps: [],

   // Thunks
   getComps: thunk(async (actions) => {
      // Handle WS Call
      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
         headers: {
            Authorization: "Bearer " + token,
         },
      });
      const comps = res.data;

      // Handle state control
      actions.setComps(comps);
   }),

   // actions
   setComps: action((state, comps) => {
      state.comps = comps;
   }),
};
