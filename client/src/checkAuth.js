/// For model actions/thunks, this will first verify that authentication is valid before executing the correct state adjustment (therefore a status object isn't replacing an array of competitions)

/// For components, this will handle redirects and front-end page loading

export const authCommand = (actions, data, execute) => {
   // Handle state control
   if (data.status && data.status === "Forbidden") {
      // Invalid token
      actions.setAuth(data.status);
   } else {
      // Execute function
      execute();
      actions.setAuth("OK");
   }
};

export const authPageCheck = (auth, setAuthing) => {
   if (auth.status === "Forbidden") {
      alert("Invalid session!");
      window.location.href = "/";
   } else if (auth.status === "OK") {
      setAuthing(false);
   }
};
