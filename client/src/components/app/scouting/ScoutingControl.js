/// Modules
import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";

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
   /**
    * Set match data dynamic state variables
    */
   /// Setup
   const [scoutName, setScoutName] = useState("");
   const [matchNumber, setMatchNumber] = useState("");
   const [teamNumber, setTeamNumber] = useState(0);
   const [crossLine, setCrossLine] = useState(false);

   /// Scoring
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

   /// State
   const [defendedTime, setDefendedTime] = useState(0);
   const [defendingTime, setDefendingTime] = useState(0);
   const [malTime, setMalTime] = useState(0);
   const [endgame, setEndgame] = useState("");

   /// Misc
   const [comments, setComments] = useState("");
   const [defenseQuality, setDefenseQuality] = useState(0);

   /**
    * Set utility static and dynamic state variables
    */
   /// Timing
   const [time, setTime] = useState(150);
   const [timeInterval, setTimeInterval] = useState(0);
   const [showTimer, setShowTimer] = useState(true);
   const timeTick = 100; // Should always be timeIncrement second(s) in ms
   const timeIncrement = 1 / 10; // Portion of a second to count by
   const autoThreshold = 135; // Seconds elapsed during teleop

   /// State intervals
   const [defendedTimeInterval, setDefendedTimeInterval] = useState(0);
   const [defendingTimeInterval, setDefendingTimeInterval] = useState(0);
   const [malTimeInterval, setMalTimeInterval] = useState(0);

   ///  User interface
   const [teamColor, setTeamColor] = useState("red");
   const [fieldFlipped, setFieldFlipped] = useState(false);
   const [activeZone, setActiveZone] = useState(6); // Center zone
   const [mode, setMode] = useState("auto");

   /// Score button flashes when clicked
   const [clickTarget, setClickTarget] = useState("");
   const [clickTargetTimer, setClickTargetTimer] = useState(null);
   const clickTargetTime = 100; // Time to flash button after clicking

   /// Successive pickup disabling
   const [pickupDisabledTimer, setPickupDisabledTimer] = useState(null);
   const pickupDisabledTime = 1000; // Min time between distinct pickups

   /// Events
   const [rawEvents, setRawEvents] = useState([]);
   const updateThresholdState = 2; /// Max time threshold (in seconds) between state updates to group
   const updateThresholdScore = 2; /// Max time threshold (in seconds) between score updates to group

   /**
    * Handle life-cycle for timer ending
    */
   useEffect(() => {
      if (time <= 0) {
         // Turn off and reset timer
         clearInterval(timeInterval);
         setTimeInterval(null);
         setTime(150);

         // Toggle all states to off
         // Second argument accounts for lagging useState timeInterval update (and can't toggle states on)
         toggleState("defended", true);
         toggleState("defending", true);
         toggleState("mal", true);
      }
      // eslint-disable-next-line
   }, [time]);

   /**
    * Define multi-purpose utility methods
    */
   /// Convert time (in seconds) to formatted string
   const convertTime = (val) =>
      `${Math.floor(val / 60)}:${String(Math.ceil(val) % 60).padStart(2, "0")}`;

   /**
    * Define Timer component methods
    */
   /// Handle timer clicks
   const clickTimer = () => {
      /// Turn on timer
      if (mode === "auto" && !timeInterval) {
         /// Store timing interval
         const interval = setInterval(() => {
            setTime((time) => +(time - timeIncrement).toFixed(2));
         }, timeTick);
         setTimeInterval(interval); /// useState can't directly hold setInterval value
      }

      // Turn off timer
      if (mode === "misc") {
         setTime(0);
         setShowTimer(false);
      }
   };

   /**
    * Define Setup component methods
    */
   /// Toggle field orientation
   const toggleFieldFlipped = () => setFieldFlipped(!fieldFlipped);

   /// Toggle crossLine
   const toggleCrossLine = () => {
      // Check timer validity
      if (!timeInterval || time < autoThreshold) return;
      else setCrossLine(!crossLine);
   };

   /**
    * Define State component methods
    */
   /// Toggle a time-based state
   const toggleState = (which, timerOff = !timeInterval) => {
      // Set variables for general state adjustment statement
      let stateInterval, setState, setStateInterval;

      // Allocate particular variables based on which state is toggling
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
         if (timerOff) return; // Check if timer off

         // Handle inter-state logic
         if (which !== "mal" && malTimeInterval) {
            toggleState("mal");
         }
         if (which === "mal") {
            if (defendedTimeInterval) toggleState("defended");
            if (defendingTimeInterval) toggleState("defending");
         }

         /// Store timing interval
         const interval = setInterval(() => {
            setState((value) => +(value + timeIncrement).toFixed(2));
         }, timeTick);
         setStateInterval(interval); /// useState can't directly hold setInterval value
      } else {
         clearInterval(stateInterval);
         setStateInterval(null);
      }
   };

   /// Toggle endgame to new state (or nothing)
   const toggleEndgame = (what) => {
      if (!timeInterval) return; // Check if timer off

      if (endgame === what) setEndgame("");
      else setEndgame(what);
   };

   /**
    * Define Field component methods
    */
   /// Set a new active zone
   const changeZone = (newZone) => {
      setActiveZone(newZone);
      if (!crossLine) toggleCrossLine(); /// Called method toggles crossLine upon movement during auto
      if (malTimeInterval) toggleState("mal"); /// Turn off mal state upon movement
   };

   /**
    * Define Score component methods
    */
   /// Increment or decrement appropriate score values
   const incrementScore = (where, amount) => {
      if (!timeInterval) return; // Check if timer off

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

      if (score + amount >= 0) {
         // Check if the value would become negative
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

   /// Increment pickup count
   const incrementPickups = () => {
      if (!timeInterval) return; // Check if timer off

      if (!pickupDisabledTimer) {
         // Adjust pickups
         setPickups(pickups + 1);

         // Adjust heatmap
         let heatmap = pickupHeatmap;
         heatmap[activeZone]++;
         setPickupHeatmap(heatmap);

         // Send target to flash the clicked button
         newClickTarget("pickup");

         // Disable pickup for a short amount of time
         setPickupDisabledTimer(
            setTimeout(() => {
               setPickupDisabledTimer(null);
            }, pickupDisabledTime)
         );
      }
   };

   /// Handle a visual effect when a score button is clicked
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

   /**
    * Define Mode component methods
    */
   /// Handle mode changing
   const onChangeMode = (newMode) => {
      if (mode === newMode) return;
      setMode(newMode);
      setShowTimer(true); /// For after the timer has been clicked in Misc to show 'SUBMIT' and 'HOME'
   };

   /**
    * Handle event creation calls during scouting upon changes to particular state variables
    */
   /* eslint-disable */
   useEffect(() => eventCrossLine(), [crossLine]);
   useEffect(() => eventState(), [
      defendedTimeInterval,
      defendingTimeInterval,
      malTimeInterval,
   ]);
   useEffect(() => eventEndgame(), [endgame]);
   useEffect(() => eventZoneChange(), [activeZone, timeInterval]); // timeInterval adds entry at start
   useEffect(() => eventScore(), [inner, outer, bottom]);
   useEffect(() => eventPickup(), [pickups]);
   /* eslint-enable */

   /// Create a new event object
   const newRawEvent = (action, value = "") => {
      return {
         action,
         value,
         zone: activeZone,
         time,
      };
   };

   /// Generate event for updated crossLine value
   const eventCrossLine = () => {
      if (!timeInterval) return; // Check if timer off
      setRawEvents([...rawEvents, newRawEvent("cross", crossLine)]);
   };

   /// Generate event upon a time-based state change containing current values
   const eventState = () => {
      if (!timeInterval) return; // Check if timer off
      setRawEvents([
         ...rawEvents,
         newRawEvent("state", {
            defended: defendedTimeInterval ? 1 : 0,
            defending: defendingTimeInterval ? 1 : 0,
            mal: malTimeInterval ? 1 : 0,
         }),
      ]);
   };

   /// Generate event upon endgame state change
   const eventEndgame = () => {
      if (!timeInterval) return; // Check if timer off
      setRawEvents([...rawEvents, newRawEvent("endgame", endgame)]);
   };

   /// Generate event upon zone change
   const eventZoneChange = () => {
      if (!timeInterval) return; // Check if timer off
      setRawEvents([...rawEvents, newRawEvent("zone")]);
   };

   /// Generate event upon score change containing current values
   const eventScore = () => {
      if (!timeInterval) return; // Check if timer off
      setRawEvents([
         ...rawEvents,
         newRawEvent("score", {
            inner,
            outer,
            bottom,
         }),
      ]);
   };

   /// Generate event upon pickup
   const eventPickup = () => {
      if (!timeInterval) return; // Check if timer off
      setRawEvents([...rawEvents, newRawEvent("pickup")]);
   };

   /**
    * Define method to compile and simplify all raw events
    */
   const compileEvents = () => {
      let newEvents = [];

      /// Define values to track state of all events
      let indexCrossLine = -1;
      let indexEndgame = -1;
      let prevTime = 150; // Time of last-checked event
      let eventTime = 150; // Earliest time in string of similar events
      let prevZone = 6; // Zone of last-checked event

      let trackingState = false;
      let prevState = { defended: 0, defending: 0, mal: 0 };
      let currentState = prevState;

      let trackingScore = false;
      let prevScore = { inner: 0, outer: 0, bottom: 0 };
      let currentScore = prevScore;

      /// Define utility methods to generated messages for complicated events
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

         // Push event to array if valid update
         if (stateMessage)
            newEvents.push({
               text: stateMessage,
               zone: prevZone,
               time: eventTime,
            });
      };

      const pushScoreMessage = () => {
         let scoreMessage = "";
         /// In case more subtractions than additions are made in a string events, record as net zero (not negative) and don't push to array
         let innerScore = Math.max(0, currentScore.inner - prevScore.inner);
         let outerScore = Math.max(0, currentScore.outer - prevScore.outer);
         let bottomScore = Math.max(0, currentScore.bottom - prevScore.bottom);
         if (innerScore) scoreMessage += `Inner x ${innerScore}; `;
         if (outerScore) scoreMessage += `Outer x ${outerScore}; `;
         if (bottomScore) scoreMessage += `Bottom x ${bottomScore}; `;

         // Push event to array if valid update
         if (scoreMessage)
            newEvents.push({
               text: scoreMessage,
               zone: prevZone,
               time: eventTime,
            });
      };

      /**
       * Parse all raw events into new form
       */
      for (let i = 0; i < rawEvents.length; i++) {
         const current = rawEvents[i];

         /// Cross Line
         if (current.action === "cross") {
            // Remove previous crossLine events and track this one
            if (indexCrossLine > -1) newEvents.splice(indexCrossLine, 1);
            indexCrossLine = newEvents.length;

            // Push event to array
            newEvents.push({
               text: "Cross Line",
               zone: current.zone,
               time: current.time,
            });
         }

         /// State
         if (current.action === "state") {
            // Record time of first update, or first after zone change / long elapsed time
            if (!trackingState) {
               eventTime = current.time;
            } else {
               if (
                  prevZone !== current.zone ||
                  prevTime - current.time > updateThresholdState
               ) {
                  pushStateMessage();
                  prevState = currentState;
                  eventTime = current.time;
               }
            }

            // Track current state
            currentState = current.value;
            trackingState = true;
         } else {
            // If end of string of state calls, set new previous state and push message
            if (trackingState) {
               trackingState = false;
               pushStateMessage();
               prevState = currentState;
            }
         }

         /// Endgame
         if (current.action === "endgame") {
            // Remove previous endgame events and track this one
            if (indexEndgame > -1) newEvents.splice(indexEndgame, 1);
            indexEndgame = newEvents.length;

            // Push event to array
            newEvents.push({
               text: current.value,
               zone: current.zone,
               time: current.time,
            });
         }

         /// Zone Changes
         if (current.action === "zone") {
            // Push event to array
            newEvents.push({
               text: "",
               zone: current.zone,
               time: current.time,
            });
         }

         /// Score
         if (current.action === "score") {
            // Record time of first update, or first after zone change / long elapsed time
            if (!trackingScore) {
               eventTime = current.time;
            } else {
               if (
                  prevZone !== current.zone ||
                  prevTime - current.time > updateThresholdScore
               ) {
                  pushScoreMessage();
                  prevScore = currentScore;
                  eventTime = current.time;
               }
            }

            // Track current state
            currentScore = current.value;
            trackingScore = true;
         } else {
            // If end of string of state calls, set new previous state and push message
            if (trackingScore) {
               trackingScore = false;
               pushScoreMessage();
               prevScore = currentScore;
            }
         }

         /// Pickups
         if (current.action === "pickup") {
            // Push event to array
            newEvents.push({
               text: "Pickup",
               zone: current.zone,
               time: current.time,
            });
         }

         /// Keep reference variables up to date
         prevZone = current.zone;
         prevTime = current.time;
      }

      /// Account for final messages if the game ended while still tracking state or score
      if (trackingState) pushStateMessage();
      if (trackingScore) pushScoreMessage();

      return newEvents;
   };

   /**
    * Compile all recorded scouting data and prepare modal for submission or go home
    */
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

   /**
    * Render Component
    */
   return (
      <Fragment>
         {/* Timer Component */}
         <ScoutingTimer
            time={convertTime(time)}
            showTimer={showTimer}
            isRunning={timeInterval}
            mustChange={mode === "auto" && time < autoThreshold}
            setupComplete={scoutName && matchNumber && teamNumber}
            clickTimer={clickTimer}
            compileForConfirm={compileForConfirm}
         />

         {/* User Area */}
         <div className={classes.userArea}>
            {/* Setup Component - Left Sidebar Auto */}
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

            {/* State Component - Left Sidebar Teleop */}
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
                  {/* Field Component - Center Auto and Teleop */}
                  <ScoutingField
                     fieldFlipped={fieldFlipped}
                     active={activeZone}
                     setActive={changeZone}
                     teamNumber={teamNumber}
                     teamColor={teamColor}
                  />

                  {/* Score Component - Right Sidebar Auto and Teleop */}
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

            {/* Misc Component */}
            {mode === "misc" && (
               <ScoutingMisc
                  setComments={setComments}
                  setDefenseQuality={setDefenseQuality}
                  defenseQuality={defenseQuality}
               />
            )}
         </div>

         {/* Mode Component */}
         <ScoutingMode mode={mode} onChangeMode={onChangeMode} />
      </Fragment>
   );
};

/// Inline class manager
const classes = {
   userArea: "userArea",
};

/// Prop Types
ScoutingControl.propTypes = {
   prepareConfirmModal: PropTypes.func, // Function to prepare the modal to confirm Submit or Go Home actions
   setMatchData: PropTypes.func, // Function to allocate scouting data values to matchData object
};

/// Export
export default ScoutingControl;
