/// Modules
import React, { useEffect, useState, Fragment } from "react";
import { useStoreActions } from "easy-peasy";
import {
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Button,
   Spinner,
} from "reactstrap";
import QueryString from "query-string";
import PropTypes from "prop-types";

/// Assets
import ScoutingControl from "./ScoutingControl";

/**
 * Scouting Component
 * ------------------
 * Allows users to gather and submit scouting data.
 */
const Scouting = ({ query }) => {
   /**
    * Set static and dynamic state variables
    */
   const compID = QueryString.parse(query).compID;

   const [loading, setLoading] = useState(false);
   const [redirectModal, setRedirectModal] = useState(false);
   const [showRedirectClose] = useState(false);
   const [messages, setMessages] = useState([]);
   const [confirmModal, setConfirmModal] = useState(false);
   const [confirmModalHeader, setConfirmModalHeader] = useState("");
   const [confirmModalBody, setConfirmModalBody] = useState("");
   const [comp, setComp] = useState({});
   const [matchData, setMatchData] = useState({});

   /**
    * Bring in easy-peasy thunks/actions
    */
   const getComp = useStoreActions((actions) => actions.getComp);
   const addPending = useStoreActions((actions) => actions.addPending);

   /**
    * Handle life-cycle
    */
   useEffect(() => {
      checkQuery();

      //eslint-disable-next-line
   }, []);

   /**
    * Define all component methods
    */
   /// Check if the compID is valid for this user
   const checkQuery = async () => {
      const res = await getComp(compID);
      if (!res.valid) {
         setMessages([{ text: res.message, type: res.type }]);
         toggleRedirectModal();
      }
      setComp(res.comp);
   };

   /// Toggle showing the redirect modal
   const toggleRedirectModal = () => setRedirectModal(!redirectModal);

   /// Toggle showing the confirm modal
   const toggleConfirmModal = () => {
      setConfirmModal(!confirmModal);
      setMessages([]);
   };

   /// Prepare the confirm modal for either submitting or going home
   const prepareConfirmModal = (action) => {
      if (action === "Submit") {
         setConfirmModalHeader("Data Submission");
         setConfirmModalBody(
            <Fragment>
               Are you <b>sure</b> you want to <b>submit</b> all of your data{" "}
               <b>right now?</b> Submitted data is sent to the Pending screen
               for review by your team admin.
            </Fragment>
         );
      } else {
         setConfirmModalHeader("Go Home");
         setConfirmModalBody(
            <Fragment>
               Are you <b>sure</b> you want to <b>go home</b>? If you haven't
               submitted, all this data wille be lost. This will be sent to the
               pending match data screen for review by your team admin.
            </Fragment>
         );
      }
      toggleConfirmModal();
   };

   /// Handle submit
   const onSubmit = async () => {
      if (loading) return;

      setLoading(true);
      const res = await addPending({ id: comp.ID, ...matchData });
      setMessages([{ text: res.message, type: res.type }]);
      setLoading(false);
   };

   const onGoHome = () => redirect();

   /// Redirect the page
   const redirect = (link = "/home") => (window.location.href = link);

   /**
    * Render component
    */
   return (
      <div className={classes.container}>
         {/* ScoutingControl Component contains all scouting app functionality */}
         <ScoutingControl
            prepareConfirmModal={prepareConfirmModal}
            setMatchData={setMatchData}
         />

         {/* Modal for redirects */}
         <Modal isOpen={redirectModal} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               Redirect
               {/* Custom close button for certain situations*/}
               {showRedirectClose && (
                  <Button
                     color='transparent'
                     className={classes.modalClose}
                     style={styles.modalClose}
                     onClick={toggleRedirectModal}>
                     &times;
                  </Button>
               )}
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

               {/* Redirect button */}
               <Button
                  color='comp-table-head'
                  className={classes.modalSubmit}
                  style={styles.button}
                  block
                  outline
                  size='md'
                  onClick={() => redirect("/")}>
                  Go
               </Button>
            </ModalBody>
         </Modal>

         {/* Modal for confirming voluntary actions like going home or submitting */}
         <Modal isOpen={confirmModal} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               {confirmModalHeader}
               {/* Custom close button */}
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={toggleConfirmModal}>
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
               {confirmModalBody}
               <br />
               <Button
                  color='comp-table-head'
                  className={classes.modalOption}
                  style={styles.modalOption.left}
                  outline
                  size='md'
                  onClick={() =>
                     confirmModalHeader === "Go Home" ? onGoHome() : onSubmit()
                  }>
                  {loading ? (
                     <Spinner
                        className={classes.spinner}
                        style={styles.spinner}
                        color='back'
                     />
                  ) : (
                     "Yes"
                  )}
               </Button>
               <Button
                  color='message-error'
                  className={classes.modalOption}
                  style={styles.modalOption.right}
                  outline
                  size='md'
                  onClick={toggleConfirmModal}>
                  No
               </Button>
            </ModalBody>
         </Modal>
      </div>
   );
};

/// Inline class manager
const classes = {
   container: "scoutingApp",
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
   modalOption: {
      left: {
         width: "48%",
         marginRight: "2%",
      },
      right: {
         width: "48%",
         marginLeft: "2%",
      },
   },
   spinner: {
      width: "1.25rem",
      height: "1.25rem",
   },
};

/// Prop Types
Scouting.propTypes = {
   query: PropTypes.string, // URL search details
};

/// Export
export default Scouting;
