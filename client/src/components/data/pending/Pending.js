/// Modules
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import QueryString from "query-string";

/// Components
import RedirectModal from "../../utils/RedirectModal";

const Pending = ({ query }) => {
   /// State
   const compID = QueryString.parse(query).compID;
   const [loading, setLoading] = useState(false);
   const [redirectModal, setRedirectModal] = useState(false);
   const [redirectMessages, setRedirectMessages] = useState([]);
   const [comp, setComp] = useState({});
   const pending = useStoreState((state) => state.pending);

   /// Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);
   const getPending = useStoreActions((actions) => actions.getPending);

   /// Life cycle
   useEffect(() => {
      requestPendingData();

      //eslint-disable-next-line
   }, []);

   useEffect(() => {
      console.log(pending);
   }, [pending]);

   /// Methods
   const requestPendingData = async () => {
      const { ID } = await checkQuery();
      const res = await getPending(ID);
      if (res.message) {
         setRedirectMessages([{ text: res.message, type: "bad" }]);
         setRedirectModal(true);
      }
   };

   const checkQuery = async () => {
      const res = await getComp(compID);
      if (!res.valid) {
         setRedirectMessages([{ text: res.message, type: res.type }]);
         toggleRedirectModal();
      }
      setComp(res.comp);

      return res.comp; // For use in requesting pending data
   };

   /// Toggle showing the redirect modal
   const toggleRedirectModal = () => setRedirectModal(!redirectModal);

   return (
      <div className={classes.container}>
         {/* Title text */}
         <h1 className={classes.title}>Pending Match Data</h1>
         <h4 className={classes.compname}>@ {comp.CompetitionName}</h4>

         <RedirectModal modal={redirectModal} messages={redirectMessages} />
      </div>
   );
};

/// Inline class manager
const classes = {
   container: "p-0 mx-3",
   title: "mb-2 mt-2 text-table-text",
   compname: "mb-4 font-weight-normal font-italic text-table-text",
};

/// Inline style manager
const styles = {};

export default Pending;
