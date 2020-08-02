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

/// Components
import UpdateModal from "./UpdateModal";

/**
 * ActionsModal Component
 * ----------------------
 * Per each DataRow component, allow competition switching, data updating, clearing, reinstating, and deleting
 */
const ActionsModal = ({
   modal,
   toggleModal,
   messages,
   overwriteModals,
   clearMessages,
   row,
   comps,
   onSubmit,
   loading,
}) => {
   /**
    * Set dynamic state variables
    */
   const [switchCompName, setSwitchCompName] = useState(
      /// Default value for switch select component
      comps.filter((comp) => comp.ID === row.CompetitionID)[0].CompetitionName
   );
   const [updateModal, setUpdateModal] = useState(false);

   /**
    * Define all component methods
    */
   /// Toggle showing the Update Modal
   const toggleUpdateModal = () => {
      setUpdateModal(!updateModal);
      clearMessages();
   };

   return (
      <Modal isOpen={!overwriteModals && modal} toggle={toggleModal} size='md'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            Team {row.TeamNumber} @ Match {row.MatchNumber}
            {/* Custom close button */}
            <Button
               color='transparent'
               className={classes.modalClose}
               style={styles.modalClose}
               onClick={toggleModal}>
               &times;
            </Button>
         </ModalHeader>
         <ModalBody>
            {/* Competition Switching */}
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
            <Form
               onSubmit={(e) =>
                  onSubmit("Switch", e, {
                     matchNumber: row.MatchNumber,
                     teamNumber: row.TeamNumber,
                     newName: switchCompName,
                  })
               }>
               <FormGroup className={classes.formGroup}>
                  {/* New Comp Name */}
                  <Input
                     className={classes.input}
                     type='select'
                     autoComplete='switch-competition-name'
                     onChange={(e) => setSwitchCompName(e.target.value)}
                     value={switchCompName}>
                     {comps.map((comp) => (
                        <option key={comp.ID}>{comp.CompetitionName}</option>
                     ))}
                  </Input>
               </FormGroup>
               <Button
                  color='data-table-head'
                  className={classes.modalSubmit}
                  style={styles.button}
                  block
                  outline
                  size='md'>
                  {loading ? (
                     <Spinner
                        className={classes.spinnerSwitch}
                        style={styles.spinner}
                        color='back'
                     />
                  ) : (
                     "Switch Competition"
                  )}
               </Button>
            </Form>
         </ModalBody>
         <hr />
         <ModalBody>
            {/* Data Updating */}
            <Button
               color='comp-table-head'
               className={classes.modalSubmit}
               style={styles.button}
               block
               outline
               size='md'
               onClick={toggleUpdateModal}>
               Update Data
            </Button>

            <UpdateModal
               key={modal} // Component reloads when ActionsModal closes
               modal={updateModal}
               toggleModal={toggleUpdateModal}
               messages={messages}
               row={row}
               loading={loading}
               onSubmit={onSubmit}
            />
         </ModalBody>
         <hr />
         <ModalBody>
            {/* Clearing and Reinstating */}
            <Form
               onSubmit={(e) =>
                  onSubmit("ClearReinstate", e, {
                     matchNumber: row.MatchNumber,
                     teamNumber: row.TeamNumber,
                     updated: !row.Updated,
                  })
               }>
               <Button
                  color={row.Updated ? "message-error" : "message-good"}
                  className={classes.modalSubmit}
                  style={styles.button}
                  block
                  outline
                  size='md'>
                  {loading ? (
                     <Spinner
                        className={
                           row.Updated
                              ? classes.spinnerClear
                              : classes.spinnerReinstate
                        }
                        style={styles.spinner}
                        color='back'
                     />
                  ) : row.Updated ? (
                     "Clear Match Data"
                  ) : (
                     "Reinstate Match Data"
                  )}
               </Button>
            </Form>
         </ModalBody>
         {/* Deleting */}
         {!row.Updated && (
            <Fragment>
               <hr />
               <ModalBody>
                  <Form
                     onSubmit={(e) =>
                        onSubmit("Delete", e, {
                           matchNumber: row.MatchNumber,
                           teamNumber: row.TeamNumber,
                        })
                     }>
                     <Button
                        color='message-error'
                        className={classes.modalSubmit}
                        style={styles.button}
                        block
                        outline
                        size='md'>
                        {loading ? (
                           <Spinner
                              className={classes.spinnerClear}
                              style={styles.spinner}
                              color='back'
                           />
                        ) : (
                           "Delete Forever"
                        )}
                     </Button>
                  </Form>
               </ModalBody>
            </Fragment>
         )}
      </Modal>
   );
};

/// Inline class manager
const classes = {
   modalHeader: "bg-data-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   formGroup: "mb-4",
   label: "pl-1 mb-3",
   input: "m-0 bg-back text-table-text",
   hr: "border-data-table-head p-0 w-100 mx-0",
   modalSubmit: "modalSubmit",
   spinnerSwitch: "bg-data-table-head",
   spinnerClear: "bg-message-error",
   spinnerReinstate: "bg-message-good",
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

/// Export
export default ActionsModal;
