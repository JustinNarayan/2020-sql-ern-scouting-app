/// Modules
import React, { useState, Fragment } from "react";
import {
   Form,
   Input,
   Button,
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Spinner,
} from "reactstrap";

const PendingRow = ({
   loading,
   comps,
   thisComp,
   data,
   onSwitch,
   onDelete,
   messages,
   clearMessages,
   overwriteModal,
}) => {
   // State
   const [actionModal, setActionModal] = useState(false);
   const [actionModalHeader, setActionModalHeader] = useState("");
   const [actionModalBody, setActionModalBody] = useState("");
   const [switchName, setSwitchName] = useState(thisComp.CompetitionName);

   const [teamNumber, setTeamNumber] = useState(data.TeamNumber);
   const [matchNumber, setMatchNumber] = useState(data.MatchNumber);
   const [robotStation, setRobotStation] = useState(data.RobotStation);
   const [crossLine, setCrossLine] = useState(data.CrossLine);
   const [bottomAuto, setBottomAuto] = useState(data.BottomAuto);
   const [outerAuto, setOuterAuto] = useState(data.OuterAuto);
   const [innerAuto, setInnerAuto] = useState(data.InnerAuto);
   const [bottomAll, setBottomAll] = useState(data.BottomAll);
   const [outerAll, setOuterAll] = useState(data.OuterAll);
   const [innerAll, setInnerAll] = useState(data.InnerAll);
   const [pickups, setPickups] = useState(data.Pickups);
   const [timeDefended, setTimeDefended] = useState(
      +data.TimeDefended.toFixed(2)
   );
   const [timeDefending, setTimeDefending] = useState(
      +data.TimeDefending.toFixed(2)
   );
   const [defenseQuality, setDefenseQuality] = useState(data.DefenseQuality);
   const [timeMal, setTimeMal] = useState(+data.TimeMal.toFixed(2));
   const [endgame, setEndgame] = useState(data.Endgame);
   const [comments, setComments] = useState(data.Comments);
   const [scoutName, setScoutName] = useState(data.ScoutName);

   /// Methods
   const handleSwitch = (newName) => {
      setSwitchName(newName);
      setActionModalHeader("Switch Competition");
      setActionModalBody(
         "Are you sure you want to switch the Competition of this Pending Match Data? It will be moved to the Pending screen of the corresponding Competition."
      );
      toggleActionModal();
   };

   const handleDelete = () => {
      setActionModalHeader("Delete Pending Match Data");
      setActionModalBody(
         "Are you sure you want to delete this Pending Match Data? It cannot be retrieved and will be gone forever."
      );
      toggleActionModal();
   };

   const handlePost = () => {
      setActionModalHeader("Post Pending Match Data");
      setActionModalBody(
         "Are you sure you want to post this Pending Match Data? It cannot be edited or deleted from this point forward."
      );
      toggleActionModal();
   };

   const onActionModalClick = () => {
      switch (actionModalHeader) {
         case "Switch Competition":
            onSwitch(switchName, data.ID);
            break;
         case "Delete Pending Match Data":
            onDelete(data.ID);
            break;
      }
   };

   /// Toggle showing the switchModal
   const toggleActionModal = () => {
      setActionModal(!actionModal);
      clearMessages();
   };

   return (
      <Fragment>
         <Form tag='tr'>
            <td>
               <Input
                  type='select'
                  className={classes.input}
                  value={thisComp.CompetitionName}
                  onChange={(e) => handleSwitch(e.target.value)}>
                  {comps.map((comp) => (
                     <option key={comp.ID}>{comp.CompetitionName}</option>
                  ))}
               </Input>
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.short}
                  min='0'
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='text'
                  className={classes.short}
                  value={matchNumber}
                  onChange={(e) => setMatchNumber(e.target.value)}
               />
            </td>
            <td
               className={
                  data.RobotStation.slice(0, 1) === "R"
                     ? classes.red
                     : classes.blue
               }>
               <Input
                  type='text'
                  className={classes.tiny}
                  value={robotStation}
                  onChange={(e) => setRobotStation(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  max='1'
                  value={crossLine}
                  onChange={(e) => setCrossLine(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={innerAuto}
                  onChange={(e) => setInnerAuto(e.target.value)}
               />
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={outerAuto}
                  onChange={(e) => setOuterAuto(e.target.value)}
               />
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={bottomAuto}
                  onChange={(e) => setBottomAuto(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={innerAll}
                  onChange={(e) => setInnerAll(e.target.value)}
               />
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={outerAll}
                  onChange={(e) => setOuterAll(e.target.value)}
               />
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={bottomAll}
                  onChange={(e) => setBottomAll(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  value={pickups}
                  onChange={(e) => setPickups(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.short}
                  min='0'
                  step='0.1'
                  value={timeDefended}
                  onChange={(e) => setTimeDefended(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.short}
                  min='0'
                  step='0.1'
                  value={timeDefending}
                  onChange={(e) => setTimeDefending(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  max='4'
                  value={defenseQuality}
                  onChange={(e) => setDefenseQuality(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.short}
                  min='0'
                  step='0.1'
                  value={timeMal}
                  onChange={(e) => setTimeMal(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='number'
                  className={classes.tiny}
                  min='0'
                  max='2'
                  value={endgame}
                  onChange={(e) => setEndgame(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='textarea'
                  className={classes.textarea}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
               />
            </td>
            <td>
               <Input
                  type='text'
                  className={classes.input}
                  value={scoutName}
                  onChange={(e) => setScoutName(e.target.value)}
               />
            </td>
            <td>
               <Button className={classes.post} onClick={() => handlePost()}>
                  POST
               </Button>
               <Button className={classes.erase} onClick={() => handleDelete()}>
                  ERASE
               </Button>
            </td>
         </Form>

         <Modal isOpen={actionModal && !overwriteModal} size='md'>
            <ModalHeader
               className={classes.modalHeader}
               style={styles.modalHeader}>
               {actionModalHeader}
               {/* Custom close button */}
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={toggleActionModal}>
                  &times;
               </Button>
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

               {actionModalBody}
               <br />
               <Button
                  color='comp-table-head'
                  className={classes.modalOption}
                  style={styles.modalOption.left}
                  outline
                  size='md'
                  onClick={() => onActionModalClick()}>
                  {loading ? (
                     <Spinner
                        className={classes.spinner}
                        style={styles.spinner}
                        color='back'
                     />
                  ) : (
                     "Yes"
                  )}
               </Button>
               <Button
                  color='message-error'
                  className={classes.modalOption}
                  style={styles.modalOption.right}
                  outline
                  size='md'
                  onClick={toggleActionModal}>
                  Back
               </Button>
            </ModalBody>
         </Modal>
      </Fragment>
   );
};

const classes = {
   input: "input",
   short: "input short",
   tiny: "input tiny",
   textarea: "input textarea",
   red: "bg-light-red",
   blue: "bg-light-blue",
   post: "bg-message-good",
   erase: "bg-message-error",
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   modalSubmit: "modalSubmit",
   modalOption: "modalSubmit mt-3",
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
      height: "40px",
   },
   button: {
      fontWeight: "400",
   },
   modalOption: {
      left: {
         width: "48%",
         marginRight: "2%",
      },
      right: {
         width: "48%",
         marginLeft: "2%",
      },
   },
   spinner: {
      width: "1.25rem",
      height: "1.25rem",
   },
};

export default PendingRow;
