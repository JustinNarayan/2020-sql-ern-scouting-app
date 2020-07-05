import React from "react";
import { Switch, Route } from "react-router-dom";
import User from "./user/User";

const Routing = () => {
   return (
      <main>
         <Switch>
            <Route exact path='/' render={() => <User mode='Login' />} />
            <Route
               exact
               path='/register'
               render={() => <User mode='Register' />}
            />
            <Route
               exact
               path='/verify'
               render={({ location: { search } }) => (
                  <User mode='Verify' query={search} />
               )}
            />
         </Switch>
      </main>
   );
};

export default Routing;
