import React, { useState, useEffect, Fragment } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Button } from "reactstrap";
import { authPageCheck } from "../../checkAuth";
import Comps from "./Comps";

const Home = () => {
   // Set state variables
   const [authing, setAuthing] = useState(true);
   const auth = useStoreState((state) => state.auth);
   const comps = useStoreState((state) => state.comps);

   // Bring in commands
   const getComps = useStoreActions((actions) => actions.getComps);

   // Define methods
   useEffect(() => {
      authPageCheck(auth, setAuthing);

      getComps();
   }, [auth, getComps]);

   // Render Component
   return (
      <Fragment>
         <Button onClick={() => console.log(comps)}>Hello</Button>
         <Comps comps={authing ? [] : comps} />
      </Fragment>
   );
};

export default Home;
