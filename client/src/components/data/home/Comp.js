import React, { useState, Fragment } from "react";
import {
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Form,
   FormGroup,
   Label,
   Input,
   Button,
   Spinner,
} from "reactstrap";

const Comp = ({
   comp,
   onEditSubmit,
   onDeleteSubmit,
   clearMessages,
   loading,
   editMessages,
   deleteMessages,
   overwriteModals,
}) => {
   // Set state variables
   const [modal, setModal] = useState(false);
   const [deleteModal, setDeleteModal] = useState(false);
   const [editCompName, setEditCompName] = useState(comp.CompetitionName);
   const [deleteScouting, setDeleteScouting] = useState(false);
   const [deleteTeams, setDeleteTeams] = useState(false);
   const [deleteMatches, setDeleteMatches] = useState(false);

   // Define methods
   const toggleModal = () => {
      setModal(!modal);
      setEditCompName(comp.CompetitionName);
      clearMessages();
   };

   const toggleDeleteModal = () => {
      setDeleteModal(!deleteModal);
   };

   const handleDeleteSubmit = async (e) => {
      onDeleteSubmit(e, comp, deleteScouting && deleteTeams && deleteMatches);
   };

   return (
      <Fragment>
         <tr>
            <td className={classes.compName}>{comp.CompetitionName}</td>
            <td className={classes.link}>Teams</td>
            <td className={classes.link}>Matches</td>
            <td className={classes.link}>Scout</td>
            <td className={classes.link}>Pit Scout</td>
            <td className={classes.link}>Pending Data</td>
            <td className={classes.link} onClick={toggleModal}>
               Actions
            </td>
         </tr>
         <Modal
            isOpen={modal && !overwriteModals} // Closes when the deleteSuccessModal is up
            toggle={toggleModal}
            size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               Actions
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={toggleModal}>
                  &times;
               </Button>
            </ModalHeader>
            <ModalBody className={classes.modalBody}>
               {editMessages.map((message) => (
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
               <Form onSubmit={(e) => onEditSubmit(e, comp, editCompName)}>
                  <FormGroup className={classes.formGroup}>
                     <Input
                        className={classes.input}
                        type='text'
                        placeholder='Edited Competition Name'
                        autoComplete='edit-competition-name'
                        onChange={(e) => setEditCompName(e.target.value)}
                        value={editCompName}
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
                        "Edit Competition Name"
                     )}
                  </Button>
               </Form>
            </ModalBody>
            <hr className={classes.hr} />
            <ModalBody>
               <Button
                  color='message-error'
                  className={classes.modalSubmit}
                  style={styles.button}
                  block
                  outline
                  size='md'
                  onClick={toggleDeleteModal}>
                  Delete Competition
               </Button>

               {/* Delete Modal is nested within main modal */}
               <Modal
                  isOpen={deleteModal && !overwriteModals} // Closes when the deleteSuccessModal is up
                  toggle={toggleDeleteModal}
                  size='md'>
                  <ModalHeader
                     className={classes.modalHeaderDelete}
                     style={styles.modalHeader}>
                     Delete Competition
                     <Button
                        color='transparent'
                        className={classes.modalClose}
                        style={styles.modalClose}
                        onClick={toggleDeleteModal}>
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
                     <Form onSubmit={(e) => handleDeleteSubmit(e)}>
                        <FormGroup className={classes.formGroupCheck}>
                           I understand that...
                        </FormGroup>
                        <FormGroup check className={classes.formGroupCheck}>
                           <Input
                              type='checkbox'
                              name='deleteScouting'
                              id='deleteScouting'
                              onChange={() =>
                                 setDeleteScouting(!deleteScouting)
                              }
                           />
                           <Label for='deleteScouting'>
                              All scouting data from {comp.CompetitionName} will
                              be deleted <b>forever</b>
                           </Label>
                        </FormGroup>
                        <FormGroup check className={classes.formGroupCheck}>
                           <Input
                              type='checkbox'
                              name='deleteTeams'
                              id='deleteTeams'
                              onChange={() => setDeleteTeams(!deleteTeams)}
                           />
                           <Label for='deleteTeams'>
                              All team data from {comp.CompetitionName} will be
                              deleted <b>forever</b>
                           </Label>
                        </FormGroup>
                        <FormGroup check className={classes.formGroup}>
                           {/* Different class for margin purposes */}
                           <Input
                              type='checkbox'
                              name='deleteMatches'
                              id='deleteMatches'
                              onChange={() => setDeleteMatches(!deleteMatches)}
                           />
                           <Label for='deleteMatches'>
                              All match data from {comp.CompetitionName} will be
                              deleted <b>forever</b>
                           </Label>
                        </FormGroup>
                        <Button
                           color='message-error'
                           className={classes.modalSubmit}
                           style={styles.button}
                           block
                           outline
                           size='md'>
                           {loading ? (
                              <Spinner
                                 className={classes.spinnerDelete}
                                 style={styles.spinner}
                                 color='back'
                              />
                           ) : (
                              "Delete Competition"
                           )}
                        </Button>
                     </Form>
                  </ModalBody>
               </Modal>
               {/* End of nested delete modal */}
            </ModalBody>
         </Modal>
      </Fragment>
   );
};

const classes = {
   compName: "compName",
   link: "link",
   modalHeader: "bg-comp-table-head text-back",
   modalHeaderDelete: "bg-message-error text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   formGroup: "mb-4",
   formGroupCheck: "mb-2",
   label: "pl-1 mb-3",
   input: "m-0 bg-back text-table-text",
   hr: "border-comp-table-head p-0 w-100 mx-0",
   modalSubmit: "modalSubmit",
   spinner: "bg-comp-table-head",
   spinnerDelete: "bg-message-error",
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

export default Comp;
