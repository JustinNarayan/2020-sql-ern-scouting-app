import React from "react";
import { Switch, Route } from "react-router-dom";

// User component
import User from "./user/User";

// Data components
import Home from "./data/home/Home";

// App components
import Scouting from "./app/scouting/Scouting";

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

            <Route exact path='/home' render={() => <Home />} />

            <Route
               exact
               path='/scout'
               render={({ location: { search } }) => (
                  <Scouting query={search} />
               )}
            />
         </Switch>
      </main>
   );
};

export default Routing;
