/// Modules
import React, { useEffect, useState, Fragment } from "react";

/// Components
import ScoutingTimer from "./ScoutingTimer";
import ScoutingSetup from "./ScoutingSetup";
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
   const timeTick = 500; // Should always be 1 second in ms

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
      if (time <= 0) {
         clearInterval(timeInterval);
      }
   });

   // Methods
   const convertTime = (val) =>
      `${Math.floor(val / 60)}:${String(val % 60).padStart(2, "0")}`;

   const clickTimer = () => {
      if (mode === "auto" && !timeInterval) {
         /// useState can not directly hold a setInterval ID
         const interval = setInterval(() => {
            setTime((time) => time - 1);
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

   const toggleFieldFlipped = () => setFieldFlipped(!fieldFlipped);

   const changeZone = (newZone) => {
      setActiveZone(newZone);
   };

   const incrementScore = (where, amount) => {
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
            time={time}
            showTimer={showTimer}
            isRunning={timeInterval}
            setupComplete={scoutName && matchNumber && teamNumber}
            convertTime={convertTime}
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
