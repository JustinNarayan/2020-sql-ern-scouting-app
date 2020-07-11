/// For model actions/thunks, this will first verify that authentication is valid before executing the correct state adjustment (therefore a status object isn't replacing an array of competitions)

export const authCommand = (data, execute) => {
   // Handle state control
   if (data.status && data.status === "Forbidden") {
      // Invalid token
      alert("Invalid session!");
      window.location.href = "/";
   } else {
      // Execute function
      execute();
   }
};
