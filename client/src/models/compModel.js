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
      const res = await axios.get(url, authHeader);
      const out = res.data; // List of comps || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Handle state control
      authCommand(out, () => actions.setComps(out));
   }),

   getComp: thunk(async (actions, id) => {
      // Handle WS Call
      const res = await axios.get(`${url}${id}`, authHeader);
      const out = res.data; // Message (w/ 'valid' and maybe 'comp') || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Send response
      return out;
   }),

   addComp: thunk(async (actions, comp) => {
      // Handle WS Call
      const res = await axios.post(url, comp, authHeader);
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getComps
      authCommand(out, () => actions.getComps());

      // Return api response to display to user
      return out;
   }),

   editComp: thunk(async (actions, compEdit) => {
      // Handle WS Call
      const res = await axios.patch(
         `${url}${compEdit.id}`,
         compEdit,
         authHeader
      );
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getComps
      authCommand(out, () => actions.getComps());

      // Return api response to display to user
      return out;
   }),

   deleteComp: thunk(async (actions, id) => {
      // Handle WS Call
      const res = await axios.delete(`${url}${id}`, authHeader);
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getComps
      authCommand(out, () => actions.getComps());

      // Return api response to display to user
      return out;
   }),

   // Actions
   setComps: action((state, comps) => {
      // Only set to value if correct type
      if (Array.isArray(comps)) state.comps = comps;
      else {
         // Issue with database
         alert("Error: see console for details");
      }
   }),
};
