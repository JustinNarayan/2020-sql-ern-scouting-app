import { thunk } from "easy-peasy";
import axios from "axios";
import authHeader from "../utils/authHeader";

const url = "/api/data/";

export default {
   // Thunks
   addData: thunk(async (actions, data) => {
      // Handle WS Call
      const res = await axios.post(`${url}${data.id}`, data, authHeader);
      const out = res.data; // Message || Forbidden

      // Log error
      if (out.err) console.log({ message: out.message, error: out.err });

      // Return api response to display to user
      return out;
   }),
};
