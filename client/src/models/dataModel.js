import { thunk, action } from "easy-peasy";
import axios from "axios";
import authHeader from "../utils/authHeader";
import { authCommand } from "../utils/checkAuth";

const url = "/api/data/";

export default {
   //State
   data: [],

   // Thunks
   getData: thunk(async (actions, id) => {
      // Handle WS Call
      const res = await axios.get(`${url}${id}`, authHeader);
      const out = res.data; // List of data || Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Handle state control
      authCommand(out, () => actions.setData(out));

      // Send response (error or comps)
      return out;
   }),

   addData: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.post(`${url}${data.id}`, data, authHeader);
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getData
      authCommand(out, () => actions.getData(data.id));

      // Return api response to display to user
      return out;
   }),

   patchData: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.patch(`${url}${data.id}`, data, authHeader);
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getData
      authCommand(out, () => actions.getData(data.id));

      // Return api response to display to user
      return out;
   }),

   deleteData: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.delete(
         `${url}${data.id}/${data.teamNumber}/${data.matchNumber}`,
         authHeader
      );
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Call to getData
      authCommand(out, () => actions.getData(data.id));

      // Return api response to display to user
      return out;
   }),

   // Actions
   setData: action((state, data) => {
      // Only set to value if correct type
      if (Array.isArray(data)) state.data = data;
      else {
         if (data.err) {
            // Issue with database
            alert("Error: see console for details");
         } else {
            // Admin issue -- dealt with in component
         }
      }
   }),
};
