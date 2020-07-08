import React, { useState, Fragment } from "react";
import { useStoreActions } from "easy-peasy";
import {
   Modal,
   ModalHeader,
   ModalBody,
   Form,
   FormGroup,
   Input,
   Button,
   Spinner,
} from "reactstrap";
const plus = require("bootstrap-icons/icons/plus-circle-fill.svg");

const AddComp = ({ onSubmit }) => {
   // Set state variables
   const [modal, setModal] = useState(false);
   const [newCompName, setNewCompName] = useState("");
   const [loading, setLoading] = useState(false);

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
            </ModalHeader>
            <ModalBody className={classes.modalBody}>
               <Form onSubmit={(e) => onSubmit(e, newCompName)}>
                  <FormGroup>
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
                           color='login-form'
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
   modalBody: "bg-back",
   input: "m-0 bg-back",
};

const styles = {
   modal: {
      width: "400px",
   },
   modalHeader: {
      paddingLeft: "20px",
   },
   button: {
      fontWeight: "400",
   },
};

export default AddComp;
