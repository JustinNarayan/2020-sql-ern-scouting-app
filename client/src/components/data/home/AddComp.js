/// Modules
import React, { useState, Fragment } from "react";
import {
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Form,
   FormGroup,
   Input,
   Button,
   Spinner,
} from "reactstrap";
import PropTypes from "prop-types";

/// Assets
import plus from "bootstrap-icons/icons/plus-circle-fill.svg";

/**
 * AddComp Component
 * -----------------
 * Allows comp creation
 */
const AddComp = ({ onSubmit, clearMessages, loading, messages }) => {
   /**
    * Set dynamic state variables
    */
   const [modal, setModal] = useState(false);
   const [newCompName, setNewCompName] = useState("");

   /**
    * Define all component methods
    */
   /// Toggle showing the add modal
   const toggleModal = () => {
      setModal(!modal);
      setNewCompName("");
      clearMessages();
   };

   /**
    * Render component
    */
   return (
      <Fragment>
         {/* Clickable icon to open modal */}
         <img
            className={classes.plus}
            src={plus}
            alt='Add Competition'
            onClick={toggleModal}
         />

         {/* Add modal */}
         <Modal isOpen={modal} toggle={toggleModal} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               New Competition
               {/* Custom close button */}
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={toggleModal}>
                  &times;
               </Button>
            </ModalHeader>
            <ModalBody className={classes.modalBody}>
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

               {/* Add form */}
               <Form onSubmit={(e) => onSubmit(e, newCompName)}>
                  <FormGroup className={classes.formGroup}>
                     {/* Comp Name */}
                     <Input
                        className={classes.input}
                        type='text'
                        placeholder='Competition Name'
                        autoComplete='new-competition-name'
                        onChange={(e) => setNewCompName(e.target.value)}
                     />
                  </FormGroup>

                  {/* Submit button to Add Comp */}
                  <Button
                     color='comp-table-head'
                     className={classes.modalSubmit}
                     style={styles.button}
                     block
                     outline
                     size='md'>
                     {loading ? (
                        <Spinner
                           className={classes.spinner}
                           style={styles.spinner}
                           color='back'
                        />
                     ) : (
                        "Submit"
                     )}
                  </Button>
               </Form>
            </ModalBody>
         </Modal>
      </Fragment>
   );
};

/// Inline class manager
const classes = {
   plus: "plus",
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   formGroup: "mb-4",
   input: "m-0 bg-back text-table-text",
   modalSubmit: "modalSubmit",
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
   spinner: {
      width: "1.25rem",
      height: "1.25rem",
   },
};

/// Prop Types
AddComp.propTypes = {
   onSubmit: PropTypes.func, // Add submission function
   clearMessages: PropTypes.func, // Function to clear add messages in the modal
   loading: PropTypes.bool, // If an async call is in progress
   messages: PropTypes.array, // List of response actions regarding add actions
};

/// Export
export default AddComp;
