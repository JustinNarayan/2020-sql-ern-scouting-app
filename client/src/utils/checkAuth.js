/// For model actions/thunks, this will first verify that authentication is valid before executing the correct state adjustment (therefore a status object isn't replacing an array of competitions)

export const authCommand = (data, execute) => {
   // Handle state control
   if (data.status && data.status === "Forbidden") {
      // Invalid token
      console.log("Invalid session");
   } else {
      // Execute function
      execute();
   }
};
