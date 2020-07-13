import { thunk } from "easy-peasy";
import axios from "axios";
import authHeader from "../utils/authHeader";

const url = "/api/users/";

export default {
   // Thunks
   login: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}login`, user);
         return await res.data;
      } catch {
         return { message: "Failed to make login request", type: "bad" };
      }
   }),

   register: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}register`, user);
         return await res.data;
      } catch {
         return { message: "Failed to make register request", type: "bad" };
      }
   }),

   verify: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}verify/${user.verifyID}`, user);
         return await res.data;
      } catch {
         return { message: "Failed to make verify request", type: "bad" };
      }
   }),

   appearAdmin: thunk(async (actions, setIsAdmin) => {
      // Handle WS Call
      try {
         let res = await axios.get(`${url}admin`, authHeader);
         setIsAdmin(res.data);
      } catch (err) {
         setIsAdmin(false);
         alert("Failed to make admin status request");
      }
   }),
};
