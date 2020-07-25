import { thunk, action } from "easy-peasy";
import axios from "axios";
import authHeader from "../utils/authHeader";
import { authCommand } from "../utils/checkAuth";

const url = "/api/pending/";

export default {
   // State
   pending: [],

   // Thunks
   getPending: thunk(async (actions, id) => {
      // Handle WS Call
      const res = await axios.get(`${url}${id}`, authHeader);
      const out = res.data; // List of pending data || Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Handle state control
      authCommand(out, () => actions.setPending(out));

      // Send response (error or comps)
      return out;
   }),

   addPending: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.post(`${url}${data.id}`, data, authHeader);
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Return api response to display to user
      return out;
   }),

   switchPendingCompetition: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.patch(
         `${url}${data.compID}/${data.dataID}`,
         data,
         authHeader
      );
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getComps
      authCommand(out, () => actions.getPending(data.compID));

      // Return api response to display to user
      return out;
   }),

   deletePending: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.delete(
         `${url}${data.compID}/${data.dataID}`,
         authHeader
      );
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getComps
      authCommand(out, () => actions.getPending(data.compID));

      // Return api response to display to user
      return out;
   }),

   // Actions
   setPending: action((state, pending) => {
      // Only set to value if correct type
      if (Array.isArray(pending)) state.pending = pending;
      else {
         if (pending.err) {
            // Issue with database
            alert("Error: see console for details");
         } else {
            // Admin issue -- dealt with in component
         }
      }
   }),
};
