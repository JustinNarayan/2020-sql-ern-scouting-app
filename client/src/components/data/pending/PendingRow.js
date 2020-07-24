/// Modules
import React, { useState, Fragment } from "react";
import { Form, Input, Button } from "reactstrap";

const PendingRow = ({ comps, comp, data }) => {
   // State
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

   return (
      <Fragment>
         <Form tag='tr'>
            <td>
               <Input type='select' className={classes.input}>
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
               <Button className={classes.post}>POST</Button>
               <Button className={classes.erase}>ERASE</Button>
            </td>
         </Form>
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
};

export default PendingRow;
