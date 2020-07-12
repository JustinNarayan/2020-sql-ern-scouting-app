/*eslint-disable*/
import React, { useEffect, useState, Fragment } from "react";
import { useStoreState } from "easy-peasy";
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
import adminLock from "bootstrap-icons/icons/shield-lock-fill.svg";
import adminCheck from "bootstrap-icons/icons/shield-fill-check.svg";

const Admin = ({ onSubmit, clearMessages, loading, messages }) => {
   // Set state variables
   const [modal, setModal] = useState(false);
   const [adminKey, setAdminKey] = useState("");
   const appearsAdmin = useStoreState((state) => state.appearsAdmin);

   // Define methods
   const toggleModal = () => {
      setModal(!modal);
      setAdminKey("");
      clearMessages();
   };

   return (
      <Fragment>
         <img
            className={appearsAdmin ? classes.none : classes.admin}
            src={adminLock}
            alt='Admin Login'
            onClick={toggleModal}
         />
         <img
            className={appearsAdmin ? classes.admin : classes.none}
            src={adminCheck}
            alt='Is Admin'
         />
         <Modal isOpen={modal} toggle={toggleModal} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               Admin Login
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
               <Form onSubmit={(e) => onSubmit(e, adminKey)}>
                  <FormGroup className={classes.formGroup}>
                     <Input
                        className={classes.input}
                        type='password'
                        placeholder='Admin Key'
                        autoComplete='admin-key'
                        onChange={(e) => setAdminKey(e.target.value)}
                     />
                  </FormGroup>
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
                        "Login"
                     )}
                  </Button>
               </Form>
            </ModalBody>
         </Modal>
      </Fragment>
   );
};

const classes = {
   admin: "admin",
   none: "none",
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   formGroup: "mb-4",
   input: "m-0 bg-back text-table-text",
   modalSubmit: "modalSubmit",
   spinner: "bg-comp-table-head",
};

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

export default Admin;
