/// Modules
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalHeader, ModalBody, Input, Button } from "reactstrap";

const PlaybackModal = ({ modal, toggleModal, row, events }) => {
   const [speed, setSpeed] = useState(1);
   const [time, setTime] = useState(0);
   const [playing, setPlaying] = useState(false);
   const [playInterval, setPlayInterval] = useState(null);
   const [currentZone, setCurrentZone] = useState(0);
   const [highlightEvent, setHighlightEvent] = useState(0);
   const eventsDiv = useRef(null);
   const playStep = 0.1;
   const second = 1000;
   const maxTime = 150;

   useEffect(() => {
      if (time >= maxTime) {
         if (playing) togglePlaying(speed, true);
         setTime(maxTime);
      }

      // Choose current event
      let eventsWithText = 0;
      events.forEach((event, index) => {
         const timeLeft = maxTime - time;
         if (event.time >= timeLeft) {
            setCurrentZone(event.zone);
            if (event.text) {
               setHighlightEvent(index);
               eventsWithText++;
            }
         }
      });
      // Scroll the events display
      if (eventsDiv.current)
         eventsDiv.current.scrollTop = (eventsWithText - 2) * 24;
   }, [time]);

   const getClass = (zone) => {
      return currentZone === zone ? classes.zone.active : "";
   };

   const formatTime = (seconds) => {
      return `T-${Math.floor(seconds / 60)}:${(seconds % 60)
         .toFixed(1)
         .padStart(4, "0")}s`;
   };

   const switchSpeed = () => {
      let newSpeed;
      newSpeed = (speed + 2) % 6; // Toggles between 1, 3, and 5
      setSpeed(newSpeed);

      togglePlaying(newSpeed, true); // Stop playing
      if (playing) togglePlaying(newSpeed, false); // If was playing before, play again
   };

   const togglePlaying = (howFast, inAction) => {
      setPlaying(!inAction);
      if (!inAction) {
         const interval = setInterval(
            () =>
               setTime((time) =>
                  Math.min(+(+time + playStep * howFast).toFixed(2), maxTime)
               ),
            second * playStep
         );
         setPlayInterval(interval);
      } else {
         clearInterval(playInterval);
         setPlayInterval(null);
      }
   };

   const closeModal = () => {
      if (playing) togglePlaying(1, true);
      toggleModal();
   };

   return (
      <Modal isOpen={modal} toggle={closeModal} size='lg'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            Playback for Team {row.TeamNumber} @ Match {row.MatchNumber}
            {/* Custom close button */}
            <Button
               color='transparent'
               className={classes.modalClose}
               style={styles.modalClose}
               onClick={closeModal}>
               &times;
            </Button>
         </ModalHeader>
         <ModalBody className={classes.modalBody}>
            <div className={classes.scrub} style={styles.scrub}>
               <Button
                  className={classes.playbackButtons}
                  color='playback'
                  size='sm'
                  block
                  onClick={switchSpeed}>
                  {speed}.0x
               </Button>
               <Input
                  type='range'
                  className={classes.scrubbar}
                  min='0'
                  max={maxTime}
                  step={playStep}
                  value={time}
                  onChange={(e) => setTime(+e.target.value)}
               />
               <p style={styles.time}>{formatTime(maxTime - time)}</p>
               <Button
                  className={classes.playbackButtons}
                  color='playback'
                  size='sm'
                  block
                  onClick={() => togglePlaying(speed, playing)}>
                  {playing ? "Stop" : "Play"}
               </Button>
            </div>
            <div className={classes.field}>
               {/* Left-side sector zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._0 + getClass(0)}
                     disabled></button>
                  <button
                     className={classes.zone._1 + getClass(1)}
                     disabled></button>
                  <button
                     className={classes.zone._2 + getClass(2)}
                     disabled></button>
               </div>

               {/* Left-side free zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._3 + getClass(3)}
                     disabled></button>
                  <button
                     className={classes.zone._4 + getClass(4)}
                     disabled></button>
               </div>

               {/* Trenches and rendezvous zone */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._5 + getClass(5)}
                     disabled></button>
                  <button
                     className={classes.zone._6 + getClass(6)}
                     disabled></button>
                  <button
                     className={classes.zone._7 + getClass(7)}
                     disabled></button>
               </div>

               {/* Right-side free zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._8 + getClass(8)}
                     disabled></button>
                  <button
                     className={classes.zone._9 + getClass(9)}
                     disabled></button>
               </div>

               {/* Right-side sector zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._10 + getClass(10)}
                     disabled></button>
                  <button
                     className={classes.zone._11 + getClass(11)}
                     disabled></button>
                  <button
                     className={classes.zone._12 + getClass(12)}
                     disabled></button>
               </div>
            </div>
            <div
               className={classes.events}
               style={styles.events}
               ref={eventsDiv}>
               {events.map((event, index) =>
                  event.text ? (
                     <p
                        key={event.time}
                        style={styles.event}
                        className={
                           highlightEvent === index
                              ? classes.highlightEvent
                              : ""
                        }>
                        <span className={classes.eventtime}>
                           {formatTime(event.time)} :
                        </span>{" "}
                        {event.text}
                     </p>
                  ) : (
                     ""
                  )
               )}
            </div>
         </ModalBody>
      </Modal>
   );
};

const classes = {
   modalHeader: "bg-playback text-back",
   modalBody: "bg-back pt-1",
   scrub: "mb-1 mx-auto",
   scrubbar: "bg-heatmap-grey",
   playbackButtons: "playbackButtons",
   field: "heatmapField mb-2",
   zone: {
      group: "group",
      _0: "_0 ", // Spaces left for heatmap colors
      _1: "_1 ",
      _2: "_2 ",
      _3: "_3 ",
      _4: "_4 ",
      _5: "_5 ",
      _6: "_6 ",
      _7: "_7 ",
      _8: "_8 ",
      _9: "_9 ",
      _10: "_10 ",
      _11: "_11 ",
      _12: "_12 ",
      active: "bg-playback",
      arrow: "arrow",
   },
   events: "bg-heatmap-grey px-2 py-0 mx-auto",
   highlightEvent: "text-playback",
   eventtime: "font-weight-bold",
   modalClose: "text-back",
   modalSubmit: "modalSubmit",
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
   scrub: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "552px",
      border: "0",
      height: "36px",
   },
   time: {
      position: "absolute",
      fontWeight: "500",
      fontSize: "24px",
      paddingTop: "15px",
      letterSpacing: "1px",
   },
   events: {
      overflowY: "scroll",
      borderRadius: "4px",
      fontSize: "15px",
      lineHeight: ".8em",
      textAlign: "center",
      letterSpacing: "1px",
      height: "80px",
      width: "552px",
   },
   event: {
      margin: "12px",
   },
};

export default PlaybackModal;
