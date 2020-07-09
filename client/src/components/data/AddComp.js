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
const plus = require("bootstrap-icons/icons/plus-circle-fill.svg");

const AddComp = ({ onSubmit, loading, messages }) => {
   // Set state variables
   const [modal, setModal] = useState(false);
   const [newCompName, setNewCompName] = useState("");

   // Define methods
   const toggleModal = () => setModal(!modal);

   return (
      <Fragment>
         <img
            className={classes.plus}
            src={plus}
            alt='Add Competition'
            onClick={toggleModal}
         />
         <Modal isOpen={modal} toggle={toggleModal} style={styles.modal}>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               New Competition
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
                        message.type === "good" ? "login-good" : "login-error"
                     }
                     className={classes.alert}>
                     {message.text}
                  </Alert>
               ))}
               <Form onSubmit={(e) => onSubmit(e, newCompName)}>
                  <FormGroup className={classes.formGroup}>
                     <Input
                        className={classes.input}
                        type='text'
                        name='newCompName'
                        placeholder='Competition Name'
                        autoComplete='new-competition-name'
                        onChange={(e) => setNewCompName(e.target.value)}
                     />
                  </FormGroup>
                  <Button
                     color='comp-table-head'
                     style={styles.button}
                     block
                     outline
                     size='md'
                     id='btnx'>
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

const classes = {
   plus: "plus",
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   formGroup: "mb-4",
   input: "m-0 bg-back",
   spinner: "bg-comp-table-head",
};

const styles = {
   modal: {
      width: "400px",
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
      height: "0",
   },
   button: {
      fontWeight: "400",
   },
   spinner: {
      width: "1.25rem",
      height: "1.25rem",
   },
};

export default AddComp;
