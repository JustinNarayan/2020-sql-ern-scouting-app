/// Modules
import React, { useEffect, useState } from "react";
import { useStoreActions } from "easy-peasy";
import { Modal, ModalHeader, ModalBody, Alert, Button } from "reactstrap";
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

   const [redirectLink, setRedirectLink] = useState("/home");
   const [redirectModal, setRedirectModal] = useState(false);
   const [showRedirectClose, setShowRedirectClose] = useState(false);
   const [messages, setMessages] = useState([]);
   const [comp, setComp] = useState({});

   /**
    * Bring in easy-peasy thunks/actions
    */
   const getComp = useStoreActions((actions) => actions.getComp);

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

   /// Redirect the page
   const redirect = () => (window.location.href = redirectLink);

   /**
    * Render component
    */
   return (
      <div className={classes.container}>
         {/* ScoutingControl Component contains all scouting app functionality */}
         <ScoutingControl />

         {/* Modal for redirects */}
         <Modal isOpen={redirectModal} size='sm'>
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
                  onClick={redirect}>
                  Go
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

/// Prop Types
Scouting.propTypes = {
   query: PropTypes.string, // URL search details
};

/// Export
export default Scouting;
