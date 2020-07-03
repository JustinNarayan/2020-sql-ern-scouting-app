import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./login/Login";

const Routing = () => {
   return (
      <main>
         <Switch>
            <Route exact path='/' component={Login} />
         </Switch>
      </main>
   );
};

export default Routing;
