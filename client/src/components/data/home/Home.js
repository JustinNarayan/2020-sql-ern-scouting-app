/// Modules
import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
   Table,
   Modal,
   ModalHeader,
   Alert,
   ModalBody,
   Button,
} from "reactstrap";

/// Components
import Admin from "./Admin";
import AddComp from "./AddComp";
import Comp from "./Comp";
import RedirectModal from "../../utils/RedirectModal";

/**
 * Home Component
 * --------------
 * Main landing page.
 * Lists all the user's competitions, allows competition creation, name editing, and deleting.
 * Allows navigation to Teams, Matches, Scouting App, Pit Scouting App, and Pending Data pages.
 */
const Home = () => {
   /**
    * Set dynamic and easy-peasy store state variables
    */
   const [loading, setLoading] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);
   const [addMessages, setAddMessages] = useState([]);
   const [editMessages, setEditMessages] = useState([]);
   const [deleteMessages, setDeleteMessages] = useState([]);
   const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
   const [redirectModal, setRedirectModal] = useState(false);
   const [redirectMessages, setRedirectMessages] = useState([]);
   const comps = useStoreState((state) => state.comps);

   /**
    * Bring in easy-peasy store thunks/actions
    */
   const appearAdmin = useStoreActions((actions) => actions.appearAdmin);
   const getComps = useStoreActions((actions) => actions.getComps);
   const addComp = useStoreActions((actions) => actions.addComp);
   const editComp = useStoreActions((actions) => actions.editComp);
   const deleteComp = useStoreActions((actions) => actions.deleteComp);

   /**
    * Handle life-cycle
    */
   useEffect(() => {
      checkComps();
      appearAdmin(setIsAdmin); // Determine admin status

      //eslint-disable-next-line
   }, []);

   /**
    * Define all component methods
    */
   /// Check the comps response and potentially redirect
   const checkComps = async () => {
      const res = await getComps();
      if (res.status) {
         setRedirectMessages([{ text: res.message, type: "bad" }]);
         setRedirectModal(true);
      }
   };

   /// Handle add submissions
   const onAddCompSubmit = async (e, competitionName) => {
      e.preventDefault();
      if (loading) return;

      if (!competitionName) {
         setAddMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else {
         setLoading(true);
         const res = await addComp({ competitionName });
         setAddMessages([{ text: res.message, type: res.type }]);
         setLoading(false);
      }
   };

   /// Handle edit submissions
   const onEditCompSubmit = async (e, comp, competitionName) => {
      e.preventDefault();
      if (loading) return;

      if (!competitionName) {
         setEditMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else if (competitionName === comp.CompetitionName) {
         setEditMessages([
            {
               text: "The edited name is the same as the original name",
               type: "bad",
            },
         ]);
      } else {
         setLoading(true);
         const res = await editComp({ id: comp.ID, competitionName });
         setEditMessages([{ text: res.message, type: res.type }]);
         setLoading(false);
      }
   };

   /// Handle delete submissions
   const onDeleteCompSubmit = async (e, comp, checked) => {
      e.preventDefault();
      if (loading) return;

      if (!checked) {
         setDeleteMessages([
            {
               text: "Delete aborted; understanding boxes not checked",
               type: "bad",
            },
         ]);
      } else {
         setLoading(true);
         const res = await deleteComp(comp.ID);
         setDeleteMessages([
            {
               text: `${res.message}${
                  res.type === "good" ? comp.CompetitionName : "" // Will display 'Successfully deleted <CompetitionName>' or a regular error message
               }`,
               type: res.type,
            },
         ]);
         setLoading(false);

         // The comp modal will unmount so open this modal to present a success message
         if (res.type === "good") {
            toggleDeleteSuccessModal();
         }
      }
   };

   /// Toggle showing delete success modal
   const toggleDeleteSuccessModal = () => {
      setDeleteSuccessModal(!deleteSuccessModal);
   };

   /**
    * Render component
    */
   return (
      <div className={classes.container}>
         {/* Landing page text */}
         <h1 className={classes.title}>
            Welcome, {localStorage.getItem("username")}!
         </h1>
         <h5 className={classes.subtitle}>
            If you need help, please visit <b>team7558.com/scouting</b> for
            tutorials and contact info for Alt-F4's Scouting Department! Thanks
            for using our app and have fun scouting!
         </h5>

         {/* Table of competitions */}
         <Table borderless className={classes.table}>
            <thead>
               <tr className={classes.tableHead}>
                  <th colSpan='7'>
                     {/* Icons and title in header */}
                     <Admin isAdmin={isAdmin} />
                     Competitions
                     <AddComp
                        onSubmit={onAddCompSubmit}
                        clearMessages={() => setAddMessages([])}
                        loading={loading}
                        messages={addMessages}
                     />
                  </th>
               </tr>
            </thead>
            <tbody>
               {/* Cycle through Comps as rows */}
               {comps.map((comp) => (
                  <Comp
                     key={comp.ID}
                     comp={comp}
                     onEditSubmit={onEditCompSubmit}
                     onDeleteSubmit={onDeleteCompSubmit}
                     clearMessages={() => {
                        setEditMessages([]);
                        setDeleteMessages([]);
                     }}
                     loading={loading}
                     editMessages={editMessages}
                     deleteMessages={deleteMessages}
                     overwriteModals={deleteSuccessModal}
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
               {deleteMessages.map((message) => (
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
         <RedirectModal
            modal={redirectModal}
            messages={redirectMessages}
            redirectTo='/'
         />
      </div>
   );
};

/// Inline class manager
const classes = {
   container: "p-0 mx-3",
   title: "mb-2 mt-2 text-table-text",
   subtitle: "pl-1 mb-4 font-weight-normal text-table-text",
   table: "compTable p-0 text-back",
   tableHead: "bg-comp-table-head",
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

/// Export
export default Home;
