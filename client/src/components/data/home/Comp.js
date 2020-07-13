/// Modules
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
import PropTypes from "prop-types";

/**
 * Comp Component
 * --------------
 * Displays a competition with navigation and edit/delete functionality.
 */
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
   /**
    * Set dynamic state variables
    */
   const [modal, setModal] = useState(false);
   const [deleteModal, setDeleteModal] = useState(false);
   const [editCompName, setEditCompName] = useState(comp.CompetitionName);
   const [deleteScouting, setDeleteScouting] = useState(false);
   const [deleteTeams, setDeleteTeams] = useState(false);
   const [deleteMatches, setDeleteMatches] = useState(false);

   /**
    * Define all component methods
    */
   /// Handle navigation
   const navigate = (to) => {
      switch (to) {
         case "scout":
            window.location.href = `/scout?compID=${comp.ID}`;
            break;
         default:
            alert("Error in navigation");
            break;
      }
   };

   /// Toggle showing main actions modal
   const toggleModal = () => {
      setModal(!modal);
      setEditCompName(comp.CompetitionName);
      clearMessages();
   };

   /// Toggle showing delete confirm modal
   const toggleDeleteModal = () => {
      setDeleteModal(!deleteModal);
   };

   /// Handle checkbox logic before a delete submission
   const handleDeleteSubmit = async (e) =>
      onDeleteSubmit(e, comp, deleteScouting && deleteTeams && deleteMatches);

   /**
    * Render component
    */
   return (
      <Fragment>
         {/* Competition row with data, navigation links, and actions function */}
         <tr>
            <td className={classes.compName}>{comp.CompetitionName}</td>
            <td className={classes.link}>Teams</td>
            <td className={classes.link}>Matches</td>
            <td className={classes.link} onClick={() => navigate("scout")}>
               Scout
            </td>
            <td className={classes.link}>Pit Scout</td>
            <td className={classes.link}>Pending Data</td>
            <td className={classes.link} onClick={toggleModal}>
               Actions
            </td>
         </tr>

         {/* Competition actions button */}
         <Modal
            isOpen={modal && !overwriteModals} // Closes when the deleteSuccessModal is up
            toggle={toggleModal}
            size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               Actions
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

               {/* Edit form */}
               <Form onSubmit={(e) => onEditSubmit(e, comp, editCompName)}>
                  <FormGroup className={classes.formGroup}>
                     {/* New Comp Name */}
                     <Input
                        className={classes.input}
                        type='text'
                        placeholder='Edited Competition Name'
                        autoComplete='edit-competition-name'
                        onChange={(e) => setEditCompName(e.target.value)}
                        value={editCompName}
                     />
                  </FormGroup>
                  {/* Submit button to Edit Comp */}
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

            {/* Visual Divider */}
            <hr className={classes.hr} />

            <ModalBody>
               {/* Delete button to open confirm modal */}
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

               {/* Nested delete modal */}
               <Modal
                  isOpen={deleteModal && !overwriteModals} // Closes when the deleteSuccessModal is up
                  toggle={toggleDeleteModal}
                  size='md'>
                  <ModalHeader
                     className={classes.modalHeaderDelete}
                     style={styles.modalHeader}>
                     Delete Competition
                     {/* Custom close button */}
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

                     {/* Delete form with checkbox confirmations */}
                     <Form onSubmit={(e) => handleDeleteSubmit(e)}>
                        <FormGroup className={classes.formGroupCheck}>
                           I understand that...
                        </FormGroup>

                        {/* Confirm checkbox 1 */}
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

                        {/* Confirm checkbox 2 */}
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

                        {/* Confirm checkbox 3 */}
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

                        {/* Submit button to Delete Comp */}
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

/// Inline class manager
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
Comp.propTypes = {
   comp: PropTypes.object, // Comp object from database
   onEditSubmit: PropTypes.func, // Edit submission function
   onDeleteSubmit: PropTypes.func, // Delete submission function
   clearMessages: PropTypes.func, // Function to clear edit and delete messages in the modal
   loading: PropTypes.bool, // If an async call is in progress
   editMessages: PropTypes.array, // List of response messages regarding edit actions
   deleteMessages: PropTypes.array, // List of response messages regarding delete actions
   overwriteModals: PropTypes.bool, // If the deleteSuccessModal is up, which would close the actions / delete modal for visual niceness
};

/// Export
export default Comp;
