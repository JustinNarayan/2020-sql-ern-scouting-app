/// Modules
import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import QueryString from "query-string";

/// Components
import DataTable from "../../utils/DataTable";
import RedirectModal from "../../utils/RedirectModal";

const Team = ({ query }) => {
   // State
   const compID = QueryString.parse(query).compID;
   const teamNumber = QueryString.parse(query).teamNumber;
   const [loading, setLoading] = useState(false);

   const [redirectModal, setRedirectModal] = useState(false);
   const [messages, setMessages] = useState([]);

   const comp = useStoreState((state) => state.comp);
   const data = useStoreState((state) => state.data).filter(
      // Filter by team and competition
      (data) =>
         data.CompetitionID === parseInt(compID) &&
         data.TeamNumber === parseInt(teamNumber)
   );

   // Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);
   const getData = useStoreActions((actions) => actions.getData);

   // Life cycle
   useEffect(() => {
      if (!teamNumber) window.location.href = "/home";

      requestData();
      // eslint-disable-next-line
   }, []);

   const requestData = async () => {
      let res = await getComp(compID);
      if (!res.valid) {
         setMessages([{ text: res.message, type: res.type }]);
         setRedirectModal(true);
      }

      res = await getData(compID);
      if (res.status) {
         setMessages([{ text: res.message, type: res.type }]);
         setRedirectModal(true);
      }
   };

   /// Toggle showing the redirect modal
   const toggleRedirectModal = () => setRedirectModal(!redirectModal);

   return (
      <div className={classes.container}>
         {/* Title text */}
         <h1 className={classes.title}>Team {teamNumber}</h1>
         <h5 className={classes.compname}>@ {comp.CompetitionName}</h5>

         <DataTable data={data} exclude={{ teamNumber: 1, robotStation: 1 }} />

         {/* Modal for redirects */}
         <RedirectModal modal={redirectModal} messages={messages} />
      </div>
   );
};

/// Inline class manager
const classes = {
   container: "p-0 mx-3",
   title: "mb-2 mt-2 text-table-text",
   compname: "mb-4 font-weight-normal font-italic text-table-text",
};

export default Team;
