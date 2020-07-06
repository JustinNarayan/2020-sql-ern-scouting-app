import { thunk, action } from "easy-peasy";
import axios from "axios";

const url = "/api/users/";

export default {
   // State
   auth: { status: "Checking" },

   // Thunks
   login: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}login`, user);
         return await res.data;
      } catch (err) {
         let res = err.response;
         return res.data;
      }
   }),

   register: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}register`, user);
         return await res.data;
      } catch (err) {
         let res = err.response;
         return res.data;
      }
   }),

   verify: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}verify/${user.verifyID}`, user);
         return await res.data;
      } catch (err) {
         let res = err.response;
         return res.data;
      }
   }),

   // Actions
   setAuth: action((state, status) => {
      state.auth.status = status;
   }),
};
