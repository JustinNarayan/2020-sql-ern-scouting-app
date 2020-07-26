/// Modules
import React, { useState } from "react";
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

const ActionsModal = ({
   modal,
   toggleModal,
   messages,
   row,
   comps,
   onSubmit,
   loading,
}) => {
   const [switchCompName, setSwitchCompName] = useState(
      comps.filter((comp) => comp.ID === row.CompetitionID)[0].CompetitionName
   );

   return (
      <Modal
         isOpen={modal} // Closes when the deleteSuccessModal is up
         toggle={toggleModal}
         size='md'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            {`Team ${row.TeamNumber} @ Match ${row.MatchNumber}`}
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

            {/* Switch form */}
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
               {/* Submit button to Open Confirm Modal */}
               <Button
                  color='data-table-head'
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
                     "Switch Competition"
                  )}
               </Button>
            </Form>
         </ModalBody>
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
   spinner: "bg-data-table-head",
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

export default ActionsModal;
