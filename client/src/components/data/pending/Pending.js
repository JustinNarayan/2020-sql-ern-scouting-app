/// Modules
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
   Table,
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Button,
} from "reactstrap";
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

   const [confirmModalHeader, setConfirmModalHeader] = useState("");
   const [confirmMessages, setConfirmMessages] = useState([]);
   const [actionMessages, setActionMessages] = useState([]);
   const [redirectModal, setRedirectModal] = useState(false);
   const [redirectMessages, setRedirectMessages] = useState([]);

   const [comp, setComp] = useState({});
   const pending = useStoreState((state) => state.pending);
   const comps = useStoreState((state) => state.comps);

   /// Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);
   const getPending = useStoreActions((actions) => actions.getPending);
   const getComps = useStoreActions((actions) => actions.getComps);
   const switchPendingCompetition = useStoreActions(
      (actions) => actions.switchPendingCompetition
   );
   const deletePending = useStoreActions((actions) => actions.deletePending);

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

   const onSwitchPendingCompetition = async (newCompetitionName, dataID) => {
      if (loading) return;

      const [newCompetitionID] = comps
         .filter((comp) => comp.CompetitionName === newCompetitionName)
         .map((comp) => comp.ID);

      setLoading(true);
      const res = await switchPendingCompetition({
         compID,
         dataID,
         newCompetitionID,
      });
      setConfirmModalHeader("Switch Competition");
      if (res.type === "bad")
         setActionMessages([{ text: res.message, type: res.type }]);
      else setConfirmMessages([{ text: res.message, type: res.type }]);
      setLoading(false);
   };

   const onDeletePending = async (dataID) => {
      if (loading) return;

      setLoading(true);
      const res = await deletePending({
         compID,
         dataID,
      });
      setConfirmModalHeader("Delete Competition");
      if (res.type === "bad")
         setActionMessages([{ text: res.message, type: res.type }]);
      else setConfirmMessages([{ text: res.message, type: res.type }]);
      setLoading(false);
   };

   /// Toggle showing the confirm modal
   const clearConfirmModal = () => setConfirmMessages([]);

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
                        Def'd (s)
                     </th>
                     <th>
                        <img
                           className={classes.clock}
                           src={clock}
                           alt='Time Spent'
                        />
                        <br />
                        Def'ing (s)
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
                        loading={loading}
                        comps={comps}
                        thisComp={comp}
                        data={data}
                        onSwitch={onSwitchPendingCompetition}
                        onDelete={onDeletePending}
                        messages={actionMessages}
                        clearMessages={() => setActionMessages([])}
                        overwriteModal={confirmMessages.length ? true : false}
                     />
                  ))}
               </tbody>
            </Table>
         </div>

         {/* Show confirmation messages for actions taken */}
         <Modal isOpen={confirmMessages.length ? true : false} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               {confirmModalHeader}
               {/* Custom close button */}
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={clearConfirmModal}>
                  &times;
               </Button>
            </ModalHeader>
            <ModalBody>
               {confirmMessages.map((message) => (
                  <Alert
                     key={message.text}
                     color={
                        message.type === "good"
                           ? "message-good"
                           : "message-error"
                     }
                     className={classes.alert}>
                     {message.text}
                  </Alert>
               ))}
               {/* Submit button */}
               <Button
                  color='comp-table-head'
                  className={classes.modalSubmit}
                  style={styles.button}
                  block
                  outline
                  size='md'
                  onClick={clearConfirmModal}>
                  OK
               </Button>
            </ModalBody>
         </Modal>

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
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   modalSubmit: "modalSubmit",
   modalOption: "modalSubmit mt-3",
   spinner: "bg-comp-table-head",
};

/// Inline style manager
const styles = {
   overflow: {
      overflowX: "scroll",
   },
   modalHeader: {
      paddingLeft: "22px",
   },
   modalClose: {
      padding: "0px",
      float: "right",
      fontSize: "26px",
      border: "0",
      right: "20px",
      top: "10px",
      position: "absolute",
      height: "40px",
   },
   button: {
      fontWeight: "400",
   },
   spinner: {
      width: "1.25rem",
      height: "1.25rem",
   },
};

export default Pending;
