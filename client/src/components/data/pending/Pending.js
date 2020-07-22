/// Modules
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Table } from "reactstrap";
import QueryString from "query-string";

/// Components
import PendingRow from "./PendingRow";
import RedirectModal from "../../utils/RedirectModal";

/// Assets
import clock from "bootstrap-icons/icons/clock-history.svg";

const Pending = ({ query }) => {
   /// State
   const compID = QueryString.parse(query).compID;
   const [loading, setLoading] = useState(false);
   const [redirectModal, setRedirectModal] = useState(false);
   const [redirectMessages, setRedirectMessages] = useState([]);
   const [comp, setComp] = useState({});
   const pending = useStoreState((state) => state.pending);
   const comps = useStoreState((state) => state.comps);

   /// Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);
   const getPending = useStoreActions((actions) => actions.getPending);
   const getComps = useStoreActions((actions) => actions.getComps);

   /// Life cycle
   useEffect(() => {
      requestPendingData();

      //eslint-disable-next-line
   }, []);

   /// Methods
   const requestPendingData = async () => {
      const { ID } = await checkQuery();
      const res = await getPending(ID);
      if (res.message) {
         setRedirectMessages([{ text: res.message, type: "bad" }]);
         setRedirectModal(true);
      }
      await requestComps();
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

   const requestComps = async () => {
      const res = await getComps();
      if (res.status) {
         setRedirectMessages([{ text: res.message, type: "bad" }]);
         setRedirectModal(true);
      }
   };

   /// Toggle showing the redirect modal
   const toggleRedirectModal = () => setRedirectModal(!redirectModal);

   return (
      <div className={classes.container}>
         {/* Title text */}
         <h1 className={classes.title}>Pending Match Data</h1>
         <h5 className={classes.compname}>@ {comp.CompetitionName}</h5>

         {/* Table of competitions with overflow-control div */}
         <div style={styles.overflow}>
            <Table borderless className={classes.table}>
               <thead>
                  <tr className={classes.tableHead}>
                     <th className={classes.long}>Competition</th>
                     <th>Team</th>
                     <th>Match</th>
                     <th>
                        Robot
                        <br />
                        Station
                     </th>
                     <th>
                        Cross
                        <br />
                        Line
                     </th>
                     <th>
                        Auto
                        <br />
                        Score
                     </th>
                     <th>
                        Total
                        <br />
                        Score
                     </th>
                     <th>Pickups</th>
                     <th>
                        <img
                           className={classes.clock}
                           src={clock}
                           alt='Time Spent'
                        />
                        <br />
                        Def'd
                     </th>
                     <th>
                        <img
                           className={classes.clock}
                           src={clock}
                           alt='Time Spent'
                        />
                        <br />
                        Def'ing
                     </th>
                     <th>
                        Defense
                        <br />
                        Quality
                     </th>
                     <th>
                        <img
                           className={classes.clock}
                           src={clock}
                           alt='Time Spent'
                        />
                        <br />
                        Mal
                     </th>
                     <th>Endgame</th>
                     <th className={classes.long}>Comments</th>
                     <th>
                        Scout
                        <br />
                        Name
                     </th>
                     <th className={classes.long}>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {/* Cycle through Pending as rows */}
                  {pending.map((data) => (
                     <PendingRow
                        key={data.ID}
                        comps={comps}
                        comp={comp}
                        data={data}
                     />
                  ))}
               </tbody>
            </Table>
         </div>

         <RedirectModal modal={redirectModal} messages={redirectMessages} />
      </div>
   );
};

/// Inline class manager
const classes = {
   container: "p-0 mx-3",
   title: "mb-2 mt-2 text-table-text",
   compname: "mb-4 font-weight-normal font-italic text-table-text",
   table: "dataTable pending p-0 text-back",
   tableHead: "bg-data-table-head",
   clock: "clock",
   long: "long",
};

/// Inline style manager
const styles = {
   overflow: {
      overflowX: "scroll",
   },
};

export default Pending;
