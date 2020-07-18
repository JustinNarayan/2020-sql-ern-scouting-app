/// Modules
import React, { useEffect, useState, Fragment } from "react";

/// Components
import ScoutingTimer from "./ScoutingTimer";
import ScoutingSetup from "./ScoutingSetup";
import ScoutingState from "./ScoutingState";
import ScoutingField from "./ScoutingField";
import ScoutingScore from "./ScoutingScore";
import ScoutingMode from "./ScoutingMode";

/**
 * ScoutingControl Component
 * -------------------------
 * Isolates Scouting App functionality for simplicity (not in the same component as the modal/messages).
 * Stores relevant match scouting state data.
 * Contains all scouting app components and handles connective functionality.
 * Bundles scouting data before submission.
 */
const ScoutingControl = ({ prepareConfirmModal }) => {
   // State
   const [scoutName, setScoutName] = useState("");
   const [matchNumber, setMatchNumber] = useState("");
   const [teamNumber, setTeamNumber] = useState(0);

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
   const timeTick = 50; // Should always be 1 second in ms

   const [defendedTime, setDefendedTime] = useState(0);
   const [defendedTimeInterval, setDefendedTimeInterval] = useState(0);
   const [defendingTime, setDefendingTime] = useState(0);
   const [defendingTimeInterval, setDefendingTimeInterval] = useState(0);
   const [malTime, setMalTime] = useState(0);
   const [malTimeInterval, setMalTimeInterval] = useState(0);

   const [endgame, setEndgame] = useState("");

   const [teamColor, setTeamColor] = useState("red");
   const [fieldFlipped, setFieldFlipped] = useState(false);
   const [activeZone, setActiveZone] = useState(6); // Center zone
   const [mode, setMode] = useState("auto");

   const [clickTarget, setClickTarget] = useState("");
   const [clickTargetTimer, setClickTargetTimer] = useState(null);
   const clickTargetTime = 100;
   const [pickupDisabledTimer, setPickupDisabledTimer] = useState(null);
   const pickupDisabledTime = 1000;

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
      `${Math.floor(val / 60)}:${String(val % 60).padStart(2, "0")}`;

   const clickTimer = () => {
      if (mode === "auto" && !timeInterval) {
         /// useState can not directly hold a setInterval ID
         const interval = setInterval(() => {
            setTime((time) => time - 1);
            console.log("helo");
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

         /// useState can not directly hold a setInterval ID
         const interval = setInterval(() => {
            setState((value) => value + 1);
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

      console.log(pickupHeatmap);
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

   // Render
   return (
      <Fragment>
         <ScoutingTimer
            time={convertTime(time)}
            showTimer={showTimer}
            isRunning={timeInterval}
            setupComplete={scoutName && matchNumber && teamNumber}
            clickTimer={clickTimer}
            prepareConfirmModal={prepareConfirmModal}
         />
         <div className={classes.userArea}>
            {mode === "auto" && (
               <ScoutingSetup
                  setScoutName={setScoutName}
                  setMatchNumber={setMatchNumber}
                  setTeamNumber={setTeamNumber}
                  setTeamColor={setTeamColor}
                  toggleFieldFlipped={toggleFieldFlipped}
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
