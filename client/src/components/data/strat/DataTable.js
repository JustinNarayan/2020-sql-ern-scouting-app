/// Modules
import React, { Fragment, useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import {
   Table,
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Button,
} from "reactstrap";

/// Components
import DataRow from "./DataRow";
import RedirectModal from "../../utils/RedirectModal";

/// Assets
import clock from "bootstrap-icons/icons/clock-history.svg";

const DataTable = ({ compID, filter, exclude }) => {
   const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
   const [redirectModal, setRedirectModal] = useState(false);
   const [redirectMessages, setRedirectMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [messages, setMessages] = useState([]);

   const comps = useStoreState((state) => state.comps);
   const comp = useStoreState((state) => state.comp);
   const data = filter(useStoreState((state) => state.data));

   // Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);
   const getComps = useStoreActions((actions) => actions.getComps);
   const getData = useStoreActions((actions) => actions.getData);
   const addData = useStoreActions((actions) => actions.addData);
   const patchData = useStoreActions((actions) => actions.patchData);
   const deleteData = useStoreActions((actions) => actions.deleteData);

   // Life cycle
   useEffect(() => {
      requestData();
      // eslint-disable-next-line
   }, []);

   const navigate = (to, payload) => {
      switch (to) {
         case "team":
            window.location.href = `/team?compID=${comp.ID}&teamNumber=${payload}`;
            break;
         case "match":
            window.location.href = `/match?compID=${comp.ID}&matchNumber=${payload}`;
            break;
         default:
            alert("Error in navigation");
            break;
      }
   };

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
         case "Update":
            onUpdate(data);
            break;
         case "ClearReinstate":
            onClearReinstate(data);
            break;
         case "Delete":
            onDelete(data);
            break;
         default:
            onSwitch(data);
            break;
      }
   };

   const onUpdate = async (request) => {
      setLoading(true);
      const res = await addData({
         id: compID,
         needsAdmin: true,
         updated: 1,
         ...request,
      });
      setMessages([{ text: res.message, type: res.type }]);
      setLoading(false);
   };

   const onClearReinstate = async (request) => {
      setLoading(true);
      const res = await patchData({ id: compID, ...request });
      setMessages([{ text: res.message, type: res.type }]);
      setLoading(false);
   };

   const onDelete = async (request) => {
      setLoading(true);
      const res = await deleteData({ id: compID, ...request });
      setMessages([{ text: res.message, type: res.type }]);
      setLoading(false);

      // The actions modal will unmount so open this modal to present a success message
      if (res.type === "good") {
         toggleDeleteSuccessModal();
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

   const clearMessages = () => setMessages([]);

   /// Toggle showing delete success modal
   const toggleDeleteSuccessModal = () => {
      setDeleteSuccessModal(!deleteSuccessModal);
   };

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
                     <th className={classes.mid}>
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
                     navigate={navigate}
                     row={row}
                     exclude={exclude}
                     comps={comps}
                     loading={loading}
                     messages={messages}
                     overwriteModals={deleteSuccessModal}
                     clearMessages={clearMessages}
                     onSubmit={onSubmit}
                  />
               ))}
            </tbody>
         </Table>

         {/* Delete Success Modal */}
         <Modal
            isOpen={deleteSuccessModal}
            toggle={toggleDeleteSuccessModal}
            size='md'>
            <ModalHeader
               className={classes.modalHeaderDelete}
               style={styles.modalHeader}>
               Delete Success
               {/* Custom close button */}
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={toggleDeleteSuccessModal}>
                  &times;
               </Button>
            </ModalHeader>
            <ModalBody>
               {messages.map((message) => (
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
                  onClick={toggleDeleteSuccessModal}>
                  OK
               </Button>
            </ModalBody>
         </Modal>

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
   mid: "mid",
   clock: "clock",
   modalHeaderDelete: "bg-message-error text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   modalSubmit: "modalSubmit",
};

/// Inline style manager
const styles = {
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
};

export default DataTable;
