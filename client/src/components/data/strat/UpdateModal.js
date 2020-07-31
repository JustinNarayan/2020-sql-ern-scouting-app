/// Modules
import React, { useState } from "react";
import {
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Table,
   Form,
   Input,
   Button,
   Spinner,
} from "reactstrap";

/// Assets
import clock from "bootstrap-icons/icons/clock-history.svg";

const UpdateModal = ({
   modal,
   toggleModal,
   messages,
   row,
   loading,
   onSubmit,
}) => {
   const [teamNumber, setTeamNumber] = useState(row.TeamNumber);
   const [matchNumber, setMatchNumber] = useState(row.MatchNumber);
   const [robotStation, setRobotStation] = useState(row.RobotStation);
   const [crossLine, setCrossLine] = useState(row.CrossLine);
   const [bottomAuto, setBottomAuto] = useState(row.BottomAuto);
   const [outerAuto, setOuterAuto] = useState(row.OuterAuto);
   const [innerAuto, setInnerAuto] = useState(row.InnerAuto);
   const [bottomAll, setBottomAll] = useState(row.BottomAll);
   const [outerAll, setOuterAll] = useState(row.OuterAll);
   const [innerAll, setInnerAll] = useState(row.InnerAll);
   const [pickups, setPickups] = useState(row.Pickups);
   const [timeDefended, setTimeDefended] = useState(
      +row.TimeDefended.toFixed(2)
   );
   const [timeDefending, setTimeDefending] = useState(
      +row.TimeDefending.toFixed(2)
   );
   const [defenseQuality, setDefenseQuality] = useState(row.DefenseQuality);
   const [timeMal, setTimeMal] = useState(+row.TimeMal.toFixed(2));
   const [endgame, setEndgame] = useState(row.Endgame);
   const [comments, setComments] = useState(row.Comments);
   const [scoutName, setScoutName] = useState(row.ScoutName);

   return (
      <Modal isOpen={modal} toggle={toggleModal} size='xl'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            {`Update Team ${row.TeamNumber} @ Match ${row.MatchNumber}`}
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
            <Form
               onSubmit={(e) =>
                  onSubmit("Update", e, {
                     teamNumber,
                     matchNumber,
                     robotStation,
                     crossLine,
                     events: row.Events,
                     outerHeatmap: row.OuterHeatmap,
                     innerHeatmap: row.InnerHeatmap,
                     pickupHeatmap: row.PickupHeatmap,
                     bottomAuto,
                     outerAuto,
                     innerAuto,
                     bottom: bottomAll,
                     outer: outerAll,
                     inner: innerAll,
                     pickups,
                     timeDefended,
                     timeDefending,
                     defenseQuality,
                     timeMal,
                     endgame,
                     comments,
                     scoutName,
                  })
               }>
               {/* Table of competitions with overflow-control div */}
               <div style={styles.overflow}>
                  <Table borderless className={classes.table}>
                     <thead>
                        <tr className={classes.tableHead}>
                           <th>Team</th>
                           <th>Match</th>
                           <th>
                              Robot
                              <br />
                              Station
                           </th>
                           <th>
                              Cross
                              <br />
                              Line
                           </th>
                           <th>
                              Auto
                              <br />
                              Score
                           </th>
                           <th>
                              Total
                              <br />
                              Score
                           </th>
                           <th>Pickups</th>
                           <th>
                              <img
                                 className={classes.clock}
                                 src={clock}
                                 alt='Time Spent'
                              />
                              <br />
                              Def'd (s)
                           </th>
                           <th>
                              <img
                                 className={classes.clock}
                                 src={clock}
                                 alt='Time Spent'
                              />
                              <br />
                              Def'ing (s)
                           </th>
                           <th>
                              Defense
                              <br />
                              Quality
                           </th>
                           <th>
                              <img
                                 className={classes.clock}
                                 src={clock}
                                 alt='Time Spent'
                              />
                              <br />
                              Mal (s)
                           </th>
                           <th>Endgame</th>
                           <th className={classes.long}>Comments</th>
                           <th className={classes.mid}>
                              Scout
                              <br />
                              Name
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
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
                                 onChange={(e) =>
                                    setMatchNumber(e.target.value)
                                 }
                              />
                           </td>
                           <td
                              className={
                                 row.RobotStation.slice(0, 1) === "R"
                                    ? classes.red
                                    : classes.blue
                              }>
                              <Input
                                 type='text'
                                 className={classes.tiny}
                                 value={robotStation}
                                 onChange={(e) =>
                                    setRobotStation(e.target.value)
                                 }
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
                                 onChange={(e) =>
                                    setTimeDefended(e.target.value)
                                 }
                              />
                           </td>
                           <td>
                              <Input
                                 type='number'
                                 className={classes.short}
                                 min='0'
                                 step='0.1'
                                 value={timeDefending}
                                 onChange={(e) =>
                                    setTimeDefending(e.target.value)
                                 }
                              />
                           </td>
                           <td>
                              <Input
                                 type='number'
                                 className={classes.tiny}
                                 min='0'
                                 max='4'
                                 value={defenseQuality}
                                 onChange={(e) =>
                                    setDefenseQuality(e.target.value)
                                 }
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
                        </tr>
                     </tbody>
                  </Table>
               </div>
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
                     "Update Data"
                  )}
               </Button>
            </Form>
         </ModalBody>
      </Modal>
   );
};

/// Inline class manager
const classes = {
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   table: "dataTable update p-0 text-back",
   tableHead: "bg-data-table-head",
   clock: "clock",
   long: "long",
   mid: "mid",
   alert: "mb-4 py-2 text-center",
   input: "input",
   short: "input short",
   tiny: "input tiny",
   textarea: "input textarea",
   red: "bg-light-red",
   blue: "bg-light-blue",
   modalSubmit: "modalSubmit mt-4",
   spinner: "bg-data-table-head",
};

/// Inline style manager
const styles = {
   overflow: {
      overflowX: "scroll",
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

export default UpdateModal;
