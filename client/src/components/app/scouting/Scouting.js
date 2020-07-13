import React, { useEffect, useState } from "react";
import { useStoreActions } from "easy-peasy";
import { Modal, ModalHeader, ModalBody, Alert, Button } from "reactstrap";
import QueryString from "query-string";

import ScoutingControl from "./ScoutingControl";

const Scouting = ({ query }) => {
   // Set general state variables
   const [redirectLink, setRedirectLink] = useState("/home");
   const [redirectModal, setRedirectModal] = useState(false);
   const [messages, setMessages] = useState([]);
   const compID = QueryString.parse(query).compID;
   const [comp, setComp] = useState({});

   // Bring in commands
   const getComp = useStoreActions((actions) => actions.getComp);

   // Check if this is a valid link
   useEffect(() => {
      checkQuery();

      //eslint-disable-next-line
   }, []);

   // Define methods
   const checkQuery = async () => {
      const res = await getComp(compID);
      if (!res.valid) {
         setMessages([{ text: res.message, type: res.type }]);
         toggleRedirectModal();
      }
      setComp(res.comp);
   };

   const toggleRedirectModal = () => setRedirectModal(!redirectModal);

   const redirect = () => {
      window.location.href = redirectLink;
   };

   return (
      <div className={classes.container}>
         <ScoutingControl />
         <Modal isOpen={redirectModal} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               Redirect
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

const classes = {
   container: "scoutingApp",
   modalHeader: "bg-comp-table-head text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   modalSubmit: "modalSubmit",
};

const styles = {
   modalHeader: {
      paddingLeft: "22px",
   },
   button: {
      fontWeight: "400",
   },
};

export default Scouting;
