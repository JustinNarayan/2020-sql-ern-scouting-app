/// Modules
import React from "react";
import { Modal, ModalHeader, ModalBody, Alert, Button } from "reactstrap";

const RedirectModal = ({ modal, messages, redirectTo }) => {
   /// Redirect the page
   const redirect = (link = "/home") => (window.location.href = link);

   return (
      <Modal isOpen={modal} size='md'>
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
                     message.type === "good" ? "message-good" : "message-error"
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
               onClick={() => redirect(redirectTo)}>
               Go
            </Button>
         </ModalBody>
      </Modal>
   );
};

const classes = {
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

export default RedirectModal;
