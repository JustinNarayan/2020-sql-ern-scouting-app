import React, { useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Button } from "reactstrap";
import Comps from "./Comps";

const Home = () => {
   // Define checkAuth
   const checkAuth = (data, defaultType) => {
      if (data.status && data.status === "Forbidden") {
         alert("Invalid sessionn!");
         history.push("/");
         return defaultType;
      } else {
         return data;
      }
   };

   // Set state variables
   const history = useHistory();
   const comps = useStoreState((state) => state.comps);

   // Bring in commands
   const getComps = useStoreActions((actions) => actions.getComps);

   // Define methods
   useEffect(() => {
      getComps();
   });

   // Render Component
   return (
      <Fragment>
         <Button onClick={() => console.log(comps)}>Hello</Button>
         <Comps comps={checkAuth(comps, [])} />
      </Fragment>
   );
};

export default Home;
