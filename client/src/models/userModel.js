import { thunk, action } from "easy-peasy";
import axios from "axios";
import authHeader from "../utils/authHeader";

const url = "/api/users/";

export default {
   // State
   appearsAdmin: false,

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

   admin: thunk(async (actions, user) => {
      // Handle WS Call
      try {
         let res = await axios.post(`${url}admin`, user, authHeader);
         const message = await res.data;
         if (message.type === "good") actions.setAppearsAdmin(true);
         return message;
      } catch (err) {
         let res = err.response;
         return res.data;
      }
   }),

   // Actions
   setAppearsAdmin: action((state, appearsAdmin) => {
      state.appearsAdmin = appearsAdmin;
   }),
};
