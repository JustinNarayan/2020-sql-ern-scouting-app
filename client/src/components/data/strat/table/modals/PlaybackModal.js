/// Modules
import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

const PlaybackModal = ({ modal, toggleModal, events }) => {
   const getClass = (zone) => {
      return "";
   };

   return (
      <Modal isOpen={modal} toggle={toggleModal} size='lg'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            Playback
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
            <div className={classes.scrub}></div>
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
            <div className={classes.events} style={styles.events}>
               {events
                  .filter((event) => event.text)
                  .map((event) => (
                     <p key={event.time}>
                        <span className={classes.time}>
                           T-{Math.floor(event.time / 60)}:
                           {(event.time % 60).toFixed(1)}s :
                        </span>{" "}
                        {event.text}
                     </p>
                  ))}
            </div>
         </ModalBody>
      </Modal>
   );
};

const classes = {
   modalHeader: "bg-playback text-back",
   modalBody: "bg-back",
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
      arrow: "arrow",
   },
   events: "bg-heatmap-grey p-2 mx-auto",
   time: "font-weight-bold",
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
   events: {
      overflowY: "scroll",
      borderRadius: "4px",
      fontSize: "15px",
      lineHeight: ".8em",
      textAlign: "center",
      letterSpacing: "1px",
      height: "80px",
      width: "560px",
   },
   button: {
      fontWeight: "400",
   },
};

export default PlaybackModal;
