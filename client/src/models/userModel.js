import { action, thunk } from "easy-peasy";
import axios from "axios";

const url = "/api/users";

export default {
   // State
   auth: {},

   // Thunks
   login: thunk(async (actions, user) => {
      // Handle WS Call
      const res = await axios.post(url, user);

      return res;
   }),
};
