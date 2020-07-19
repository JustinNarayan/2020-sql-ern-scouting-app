//eslint-disable
/// Modules
import React, { useEffect, useState, Fragment } from "react";

/// Components
import ScoutingTimer from "./ScoutingTimer";
import ScoutingSetup from "./ScoutingSetup";
import ScoutingState from "./ScoutingState";
import ScoutingField from "./ScoutingField";
import ScoutingScore from "./ScoutingScore";
import ScoutingMisc from "./ScoutingMisc";
import ScoutingMode from "./ScoutingMode";

/**
 * ScoutingControl Component
 * -------------------------
 * Isolates Scouting App functionality for simplicity (not in the same component as the modal/messages).
 * Stores relevant match scouting state data.
 * Contains all scouting app components and handles connective functionality.
 * Bundles scouting data before submission.
 */
const ScoutingControl = ({ prepareConfirmModal, setMatchData }) => {
   // State
   const [scoutName, setScoutName] = useState("");
   const [matchNumber, setMatchNumber] = useState("");
   const [teamNumber, setTeamNumber] = useState(0);

   const [crossLine, setCrossLine] = useState(false);

   const [inner, setInner] = useState(0);
   const [outer, setOuter] = useState(0);
   const [bottom, setBottom] = useState(0);
   const [innerAuto, setInnerAuto] = useState(0);
   const [outerAuto, setOuterAuto] = useState(0);
   const [bottomAuto, setBottomAuto] = useState(0);
   const [pickups, setPickups] = useState(0);
   const [innerHeatmap, setInnerHeatmap] = useState(new Array(13).fill(0));
   const [outerHeatmap, setOuterHeatmap] = useState(new Array(13).fill(0));
   const [pickupHeatmap, setPickupHeatmap] = useState(new Array(13).fill(0));

   const [time, setTime] = useState(150);
   const [timeInterval, setTimeInterval] = useState(0);
   const [showTimer, setShowTimer] = useState(true);
   const timeTick = 50; // Should always be 1/10 second in ms
   const timeIncrement = 1 / 10;
   const autoThreshold = 135;

   const [defendedTime, setDefendedTime] = useState(0);
   const [defendedTimeInterval, setDefendedTimeInterval] = useState(0);
   const [defendingTime, setDefendingTime] = useState(0);
   const [defendingTimeInterval, setDefendingTimeInterval] = useState(0);
   const [malTime, setMalTime] = useState(0);
   const [malTimeInterval, setMalTimeInterval] = useState(0);

   const [endgame, setEndgame] = useState("");

   const [comments, setComments] = useState("");
   const [defenseQuality, setDefenseQuality] = useState(0);

   const [teamColor, setTeamColor] = useState("red");
   const [fieldFlipped, setFieldFlipped] = useState(false);
   const [activeZone, setActiveZone] = useState(6); // Center zone
   const [mode, setMode] = useState("auto");

   const [clickTarget, setClickTarget] = useState("");
   const [clickTargetTimer, setClickTargetTimer] = useState(null);
   const clickTargetTime = 100;
   const [pickupDisabledTimer, setPickupDisabledTimer] = useState(null);
   const pickupDisabledTime = 1000;

   const [rawEvents, setRawEvents] = useState([]);
   const updateThresholdState = 2;
   const updateThresholdScore = 2;

   useEffect(() => {
      // Handle timer end
      if (time <= 0) {
         // Turn off and reset timer
         clearInterval(timeInterval);
         setTimeInterval(null);
         setTime(150);

         // Toggle all states to off (if they were off, they can't turn on)
         toggleState("defended", true);
         toggleState("defending", true);
         toggleState("mal", true);
      }
   }, [time]);

   // Methods
   const convertTime = (val) =>
      `${Math.floor(val / 60)}:${String(Math.ceil(val) % 60).padStart(2, "0")}`;

   const clickTimer = () => {
      if (mode === "auto" && !timeInterval) {
         /// useState can not directly hold a setInterval ID
         const interval = setInterval(() => {
            setTime((time) => +(time - timeIncrement).toFixed(2));
         }, timeTick);
         setTimeInterval(interval);
      }
      if (mode === "misc") {
         clearInterval(timeInterval);
         setTimeInterval(null);
         setTime(150);
         setShowTimer(false);
      }
   };

   const toggleCrossLine = () => {
      if (!timeInterval || time < autoThreshold) return;
      else setCrossLine(!crossLine);
   };

   const toggleState = (which, timerOff = !timeInterval) => {
      // Set variables for state toggling
      let stateInterval, setState, setStateInterval;

      // Determine set of variables for toggling
      switch (which) {
         case "defended":
            stateInterval = defendedTimeInterval;
            setState = setDefendedTime;
            setStateInterval = setDefendedTimeInterval;
            break;
         case "defending":
            stateInterval = defendingTimeInterval;
            setState = setDefendingTime;
            setStateInterval = setDefendingTimeInterval;
            break;
         default:
            stateInterval = malTimeInterval;
            setState = setMalTime;
            setStateInterval = setMalTimeInterval;
            break;
      }

      // Generalized toggle statement
      if (!stateInterval) {
         if (timerOff) return; // Can't toggle state if timer has run out

         // Handle inter-state logic
         if (which !== "mal" && malTimeInterval) {
            toggleState("mal");
         }
         if (which === "mal") {
            if (defendedTimeInterval) toggleState("defended");
            if (defendingTimeInterval) toggleState("defending");
         }

         /// useState can not directly hold a setInterval ID
         const interval = setInterval(() => {
            setState((value) => +(value + timeIncrement).toFixed(2));
         }, timeTick);
         setStateInterval(interval);
      } else {
         clearInterval(stateInterval);
         setStateInterval(null);
      }
   };

   const toggleEndgame = (what) => {
      if (!timeInterval) return;

      if (endgame === what) setEndgame("");
      else setEndgame(what);
   };

   const toggleFieldFlipped = () => setFieldFlipped(!fieldFlipped);

   const changeZone = (newZone) => {
      setActiveZone(newZone);
      if (!crossLine) toggleCrossLine(); /// If still in auto (in called method), will set crossLine to true
      if (malTimeInterval) toggleState("mal");
   };

   const incrementScore = (where, amount) => {
      if (!timeInterval) return;

      // Set variables for general score adjustment statement below
      let score, scoreAuto, setScore, setScoreAuto, heatmap, setHeatmap;

      // Determine set of variables for score adjustment
      switch (where) {
         case "inner":
            score = inner;
            scoreAuto = innerAuto;
            heatmap = innerHeatmap;
            setScore = setInner;
            setScoreAuto = setInnerAuto;
            setHeatmap = setInnerHeatmap;
            break;
         case "outer":
            score = outer;
            scoreAuto = outerAuto;
            heatmap = outerHeatmap;
            setScore = setOuter;
            setScoreAuto = setOuterAuto;
            setHeatmap = setOuterHeatmap;
            break;
         default:
            score = bottom;
            scoreAuto = bottomAuto;
            setScore = setBottom;
            setScoreAuto = setBottomAuto;
            break;
      }

      // Adjust score if valid
      if (score + amount >= 0) {
         // Adjust score
         setScore(score + amount);
         if (mode === "auto") setScoreAuto(Math.max(0, scoreAuto + amount));

         // Adjust heatmap if not bottom
         if (heatmap) {
            heatmap[activeZone] = Math.max(0, heatmap[activeZone] + amount);
            setHeatmap(heatmap);
         }

         // Send target to flash the clicked button
         newClickTarget(`${where}_${amount}`);
      }
   };

   const incrementPickups = () => {
      if (!timeInterval) return;

      if (!pickupDisabledTimer) {
         // Adjust pickups
         setPickups(pickups + 1);

         // Adjust heatmap
         let heatmap = pickupHeatmap;
         heatmap[activeZone]++;
         setPickupHeatmap(heatmap);

         // Send target to flash the clicked button
         newClickTarget("pickup");

         // Disable pickup shortly
         setPickupDisabledTimer(
            setTimeout(() => {
               setPickupDisabledTimer(null);
            }, pickupDisabledTime)
         );
      }
   };

   const newClickTarget = (what) => {
      setClickTarget(what);
      if (clickTargetTimer) clearTimeout(clickTarget);
      setClickTargetTimer(
         setTimeout(() => {
            setClickTarget("");
            setClickTargetTimer(null);
         }, clickTargetTime)
      );
   };

   const onChangeMode = (newMode) => {
      if (mode === newMode) return;
      setMode(newMode);
      setShowTimer(true); /// For after the timer has been clicked to show 'SUBMIT' and 'HOME'
   };

   // Compile for submit
   const compileForConfirm = (modalOption) => {
      setMatchData({
         updated: 1,
         teamNumber,
         matchNumber,
         robotStation: teamColor === "red" ? "R1" : "B1",
         events: JSON.stringify(compileEvents()),
         outerHeatmap: JSON.stringify(outerHeatmap),
         innerHeatmap: JSON.stringify(innerHeatmap),
         pickupHeatmap: JSON.stringify(pickupHeatmap),
         crossLine,
         bottomAuto,
         outerAuto,
         innerAuto,
         bottom,
         outer,
         inner,
         pickups,
         timeDefended: defendedTime,
         timeDefending: defendingTime,
         defenseQuality: defendingTime > 0 ? Math.max(1, defenseQuality) : 0,
         timeMal: malTime,
         endgameScore: endgame === "Hanged" ? 2 : endgame === "Parked" ? 1 : 0,
         score: 0,
         comments,
         scoutName,
      });

      prepareConfirmModal(modalOption);
   };

   /// Handle event array
   useEffect(() => eventCrossLine(), [crossLine]);
   useEffect(() => eventState(), [
      defendedTimeInterval,
      defendingTimeInterval,
      malTimeInterval,
   ]);
   useEffect(() => eventEndgame(), [endgame]);
   useEffect(() => eventZoneChange(), [activeZone, timeInterval]);
   useEffect(() => eventScore(), [inner, outer, bottom]);
   useEffect(() => eventPickup(), [pickups]);

   const newRawEvent = (action, value = "") => {
      return {
         action,
         value,
         zone: activeZone,
         time,
      };
   };

   const eventCrossLine = () => {
      if (!timeInterval) return;
      setRawEvents([...rawEvents, newRawEvent("cross", crossLine)]);
   };

   const eventState = () => {
      if (!timeInterval) return;
      setRawEvents([
         ...rawEvents,
         newRawEvent("state", {
            defended: defendedTimeInterval ? 1 : 0,
            defending: defendingTimeInterval ? 1 : 0,
            mal: malTimeInterval ? 1 : 0,
         }),
      ]);
   };

   const eventEndgame = () => {
      if (!timeInterval) return;
      setRawEvents([...rawEvents, newRawEvent("endgame", endgame)]);
   };

   const eventZoneChange = () => {
      if (!timeInterval) return;
      setRawEvents([...rawEvents, newRawEvent("zone")]);
   };

   const eventScore = () => {
      if (!timeInterval) return;
      setRawEvents([
         ...rawEvents,
         newRawEvent("score", {
            inner,
            outer,
            bottom,
         }),
      ]);
   };

   const eventPickup = () => {
      if (!timeInterval) return;
      setRawEvents([...rawEvents, newRawEvent("pickup")]);
   };

   const compileEvents = () => {
      let newEvents = [];

      /// Tracking values
      let indexCrossLine = -1;
      let indexEndgame = -1;
      let prevTime = 150;
      let eventTime = 150;
      let prevZone = 6;
      let trackingState = false;
      let prevState = { defended: 0, defending: 0, mal: 0 };
      let currentState = prevState;
      let trackingScore = false;
      let prevScore = { inner: 0, outer: 0, bottom: 0 };
      let currentScore = prevScore;

      /// Utility methods
      const pushStateMessage = () => {
         let stateMessage = `${
            prevState.defended === currentState.defended
               ? ""
               : currentState.defended
               ? "Start Defended; "
               : "End Defended; "
         }${
            prevState.defending === currentState.defending
               ? ""
               : currentState.defending
               ? "Start Defending; "
               : "End Defending; "
         }${
            prevState.mal === currentState.mal
               ? ""
               : currentState.mal
               ? "Start Mal; "
               : "End Mal; "
         }`;

         // Push Message
         if (stateMessage)
            newEvents.push({
               text: stateMessage,
               zone: prevZone,
               time: eventTime,
            });
      };

      const pushScoreMessage = () => {
         let scoreMessage = "";
         let innerScore = Math.max(0, currentScore.inner - prevScore.inner);
         let outerScore = Math.max(0, currentScore.outer - prevScore.outer);
         let bottomScore = Math.max(0, currentScore.bottom - prevScore.bottom);
         if (innerScore) scoreMessage += `Inner x ${innerScore}; `;
         if (outerScore) scoreMessage += `Outer x ${outerScore}; `;
         if (bottomScore) scoreMessage += `Bottom x ${bottomScore}; `;

         // Push Message
         if (scoreMessage)
            newEvents.push({
               text: scoreMessage,
               zone: prevZone,
               time: eventTime,
            });
      };

      for (let i = 0; i < rawEvents.length; i++) {
         const current = rawEvents[i];

         /// Cross Line
         if (current.action === "cross") {
            if (indexCrossLine > -1) newEvents.splice(indexCrossLine, 1);
            indexCrossLine = newEvents.length;
            newEvents.push({
               text: "Cross Line",
               zone: current.zone,
               time: current.time,
            });
         }

         /// State
         if (current.action === "state") {
            /// If was tracking state but time has passed or zone has changed, set new previous state and push message
            if (trackingState) {
               if (
                  prevZone !== current.zone ||
                  prevTime - current.time > updateThresholdState
               ) {
                  pushStateMessage();
                  prevState = currentState;
                  eventTime = current.time;
               }
            } else {
               eventTime = current.time;
            }

            currentState = current.value;
            trackingState = true;
         } else {
            /// If end of string of state calls, set new previous state and push message
            if (trackingState) {
               trackingState = false;
               pushStateMessage();
               prevState = currentState;
            }
         }

         /// Endgame
         if (current.action === "endgame") {
            if (indexEndgame > -1) newEvents.splice(indexEndgame, 1);
            indexEndgame = newEvents.length;
            newEvents.push({
               text: current.value,
               zone: current.zone,
               time: current.time,
            });
         }

         /// Zone Changes
         if (current.action === "zone")
            newEvents.push({
               text: "",
               zone: current.zone,
               time: current.time,
            });

         /// Score
         if (current.action === "score") {
            /// If was tracking score but time has passed or zone has changed, set new previous score and push message
            if (trackingScore) {
               if (
                  prevZone !== current.zone ||
                  prevTime - current.time > updateThresholdScore
               ) {
                  pushScoreMessage();
                  prevScore = currentScore;
                  eventTime = current.time;
               }
            } else {
               eventTime = current.time;
            }

            currentScore = current.value;
            trackingScore = true;
         } else {
            /// If end of string of state calls, set new previous state and push message
            if (trackingScore) {
               trackingScore = false;
               pushScoreMessage();
               prevScore = currentScore;
            }
         }

         /// Pickups
         if (current.action === "pickup")
            newEvents.push({
               text: "Pickup",
               zone: current.zone,
               time: current.time,
            });

         /// Keep reference variables up to date
         prevZone = current.zone;
         prevTime = current.time;
      }

      /// Account for final messages if the game ended while still tracking
      if (trackingState) pushStateMessage();
      if (trackingScore) pushScoreMessage();

      // let stringifiedObjects = newEvents.map(
      //    (obj) => `${obj.text}/${obj.zone}/${obj.time}`
      // );
      // console.log(stringifiedObjects.toString());
      return newEvents;
   };

   // Render
   return (
      <Fragment>
         <ScoutingTimer
            time={convertTime(time)}
            showTimer={showTimer}
            isRunning={timeInterval}
            mustChange={mode === "auto" && time < autoThreshold}
            setupComplete={scoutName && matchNumber && teamNumber}
            clickTimer={clickTimer}
            compileForConfirm={compileForConfirm}
         />
         <div className={classes.userArea}>
            {mode === "auto" && (
               <ScoutingSetup
                  setScoutName={setScoutName}
                  setMatchNumber={setMatchNumber}
                  setTeamNumber={setTeamNumber}
                  setTeamColor={setTeamColor}
                  toggleFieldFlipped={toggleFieldFlipped}
                  crossLine={crossLine}
                  toggleCrossLine={toggleCrossLine}
               />
            )}
            {mode === "teleop" && (
               <ScoutingState
                  toggleState={toggleState}
                  defendedTime={convertTime(defendedTime)}
                  defendingTime={convertTime(defendingTime)}
                  malTime={convertTime(malTime)}
                  defendedOn={defendedTimeInterval}
                  defendingOn={defendingTimeInterval}
                  malOn={malTimeInterval}
                  endgame={endgame}
                  toggleEndgame={toggleEndgame}
               />
            )}
            {(mode === "auto" || mode === "teleop") && (
               <Fragment>
                  <ScoutingField
                     fieldFlipped={fieldFlipped}
                     active={activeZone}
                     setActive={changeZone}
                     teamNumber={teamNumber}
                     teamColor={teamColor}
                  />
                  <ScoutingScore
                     clickTarget={clickTarget}
                     bottom={bottom}
                     outer={outer}
                     inner={inner}
                     pickups={pickups}
                     incrementScore={incrementScore}
                     incrementPickups={incrementPickups}
                  />
               </Fragment>
            )}
            {mode === "misc" && (
               <ScoutingMisc
                  setComments={setComments}
                  setDefenseQuality={setDefenseQuality}
                  defenseQuality={defenseQuality}
               />
            )}
         </div>
         <ScoutingMode mode={mode} onChangeMode={onChangeMode} />
      </Fragment>
   );
};

const classes = {
   userArea: "userArea",
};

/// Export
export default ScoutingControl;
