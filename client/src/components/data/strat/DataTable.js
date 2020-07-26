/// Modules
import React, { Fragment, useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Table } from "reactstrap";

/// Components
import DataRow from "./DataRow";
import RedirectModal from "../../utils/RedirectModal";

/// Assets
import clock from "bootstrap-icons/icons/clock-history.svg";

const DataTable = ({ compID, filter, exclude }) => {
   const [redirectModal, setRedirectModal] = useState(false);
   const [redirectMessages, setRedirectMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [messages, setMessages] = useState([]);

   const comps = useStoreState((state) => state.comps);
   const comp = useStoreState((state) => state.comp);
   const data = useStoreState((state) => state.data).filter((data) =>
      filter(data)
   );

   // Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);
   const getComps = useStoreActions((actions) => actions.getComps);
   const getData = useStoreActions((actions) => actions.getData);
   const patchData = useStoreActions((actions) => actions.patchData);

   // Life cycle
   useEffect(() => {
      requestData();
      // eslint-disable-next-line
   }, []);

   const requestData = async () => {
      let res = await getComp(compID);
      if (!res.valid) {
         setRedirectMessages([{ text: res.message, type: res.type }]);
         setRedirectModal(true);
      }

      res = await getComps();
      if (res.status) {
         setRedirectMessages([{ text: res.message, type: res.type }]);
         setRedirectModal(true);
      }

      res = await getData(compID);
      if (res.status) {
         setRedirectMessages([{ text: res.message, type: res.type }]);
         setRedirectModal(true);
      }
   };

   const onSubmit = (type, e, data) => {
      e.preventDefault();
      if (loading) return;

      switch (type) {
         case "ClearReinstate":
            onClearReinstate(data);
            break;
         default:
            onSwitch(data);
            break;
      }
   };

   const onSwitch = async (request) => {
      const { matchNumber, teamNumber, newName } = request;

      if (newName === comp.CompetitionName) {
         setMessages([
            { text: "That is the current competition", type: "bad" },
         ]);
      } else {
         const [newCompetitionID] = comps
            .filter((comp) => comp.CompetitionName === newName)
            .map((comp) => comp.ID);

         setLoading(true);
         const res = await patchData({
            id: compID,
            matchNumber,
            teamNumber,
            newCompetitionID,
         });
         setMessages([{ text: res.message, type: res.type }]);
         setLoading(false);
      }
   };

   const onClearReinstate = async (request) => {
      setLoading(true);
      const res = await patchData({ id: compID, ...request });
      setMessages([{ text: res.message, type: res.type }]);
      setLoading(false);
   };

   const clearMessages = () => setMessages([]);

   return (
      <Fragment>
         <Table borderless className={classes.table}>
            <thead>
               <tr className={classes.tableHead}>
                  {!exclude.teamNumber && <th>Team</th>}
                  {!exclude.matchNumber && <th>Match</th>}
                  {!exclude.robotStation && (
                     <th>
                        Robot
                        <br />
                        Station
                     </th>
                  )}
                  {!exclude.playback && <th>Playback</th>}
                  <th>Heatmap</th>
                  <th>
                     Cross
                     <br />
                     Line
                  </th>
                  <th>
                     Auto
                     <br />
                     Shots
                  </th>
                  <th>
                     Total
                     <br />
                     Shots
                  </th>
                  <th>Pickups</th>
                  <th>
                     <img
                        className={classes.clock}
                        src={clock}
                        alt='Time Spent'
                     />
                     <br />
                     D'd (s)
                  </th>
                  <th>
                     <img
                        className={classes.clock}
                        src={clock}
                        alt='Time Spent'
                     />
                     <br />
                     D'ing (s)
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
                     Mal (s)
                  </th>
                  <th>Endgame</th>
                  {!exclude.comments && (
                     <th className={classes.long}>Comments</th>
                  )}
                  {!exclude.scoutName && (
                     <th>
                        Scout
                        <br />
                        Name
                     </th>
                  )}
                  {!exclude.actions && <th>Actions</th>}
               </tr>
            </thead>
            <tbody>
               {data.map((row) => (
                  <DataRow
                     key={row.ID || row.TeamNumber} // For averages, there will not be an ID, but Team Number will be unique
                     row={row}
                     exclude={exclude}
                     comps={comps}
                     loading={loading}
                     messages={messages}
                     clearMessages={clearMessages}
                     onSubmit={onSubmit}
                  />
               ))}
            </tbody>
         </Table>

         {/* Modal for redirects */}
         <RedirectModal modal={redirectModal} messages={redirectMessages} />
      </Fragment>
   );
};

/// Inline class manager
const classes = {
   table: "dataTable p-0 text-back",
   tableHead: "bg-data-table-head",
   long: "long",
   clock: "clock",
};

export default DataTable;
