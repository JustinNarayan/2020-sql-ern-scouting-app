/// Modules
import React from "react";
import { Switch, Route } from "react-router-dom";

/// Components
import User from "./user/User";

import Home from "./data/home/Home";
import Pending from "./data/pending/Pending";

import Scouting from "./app/scouting/Scouting";

/**
 * Routing Component
 * -----------------
 * Manages all front-end routes.
 */
const Routing = () => {
   /**
    * Render component
    */
   return (
      <main>
         <Switch>
            {/* User Routes */}
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

            {/* Data Routes */}
            <Route exact path='/home' render={() => <Home />} />
            <Route
               exact
               path='/pending'
               render={({ location: { search } }) => <Pending query={search} />}
            />

            {/* App Routes */}
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

/// Export
export default Routing;
