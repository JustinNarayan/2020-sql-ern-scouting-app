import { action, thunk } from "easy-peasy";
import axios from "axios";

const url = "/api/users/";

export default {
   // State
   auth: {},

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
};
