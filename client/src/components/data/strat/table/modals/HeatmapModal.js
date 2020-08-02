/// Modules
import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

/// Assets
import arrow from "bootstrap-icons/icons/arrow-left-circle-fill.svg";

/**
 * HeatmapModal Component
 * ----------------------
 * Per each DataRow component, present heatmap arrays visually
 */
const HeatmapModal = ({
   modal,
   toggleModal,
   row,
   outerHeatmap,
   innerHeatmap,
   pickupHeatmap,
}) => {
   /**
    * Set dynamic state variables
    */
   const [mode, setMode] = useState("Outer");
   const [current, setCurrent] = useState(outerHeatmap);
   const [outOf, setOutOf] = useState(
      outerHeatmap.reduce((total, thisZone) => (total += thisZone), 0)
   );

   /**
    * Define all component methods
    */
   /// Assign classes for background color based on each zone button
   const getClass = (zone) => {
      if (current[zone] === 0) return classes.heatmapGrey;
      else {
         if (mode === "Outer") return classes.heatmapOuter;
         if (mode === "Inner") return classes.heatmapInner;
         else return classes.heatmapPickup;
      }
   };

   /// Assign style opacity based on proportional heatmap density (i.e. shots taken here out of shots taken total)
   const getStyle = (zone) => {
      return current[zone] === 0 ? {} : { opacity: current[zone] / outOf };
   };

   /// Switch between heatmap modes
   const changeMode = (newMode) => {
      setMode(newMode);
      switch (newMode) {
         case "Outer":
            setCurrent(outerHeatmap);
            setOutOf(
               outerHeatmap.reduce((total, thisZone) => (total += thisZone), 0)
            );
            break;
         case "Inner":
            setCurrent(innerHeatmap);
            setOutOf(
               innerHeatmap.reduce((total, thisZone) => (total += thisZone), 0)
            );
            break;
         default:
            setCurrent(pickupHeatmap);
            setOutOf(
               pickupHeatmap.reduce((total, thisZone) => (total += thisZone), 0)
            );
            break;
      }
   };

   /**
    * Render component
    */
   return (
      <Modal isOpen={modal} toggle={toggleModal} size='lg'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            {mode} Heatmap for Team {row.TeamNumber}{" "}
            {row.MatchNumber ? `@ Match ${row.MatchNumber}` : ""}
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
            {/* Show field for visual representation of heatmaps */}
            <div className={classes.field}>
               {/* Left-side sector zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._0 + getClass(0)}
                     style={getStyle(0)}
                     disabled>
                     {current[0] ? current[0] : ""}
                  </button>
                  <button
                     className={classes.zone._1 + getClass(1)}
                     style={getStyle(1)}
                     disabled>
                     {current[1] ? current[1] : ""}
                  </button>
                  <button
                     className={classes.zone._2 + getClass(2)}
                     style={getStyle(2)}
                     disabled>
                     {current[2] ? current[2] : ""}
                  </button>
               </div>

               {/* Left-side free zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._3 + getClass(3)}
                     style={getStyle(3)}
                     disabled>
                     {current[3] ? current[3] : ""}
                  </button>
                  <button
                     className={classes.zone._4 + getClass(4)}
                     style={getStyle(4)}
                     disabled>
                     {current[4] ? current[4] : ""}
                  </button>
               </div>

               {/* Trenches and rendezvous zone */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._5 + getClass(5)}
                     style={getStyle(5)}
                     disabled>
                     {current[5] ? current[5] : ""}
                  </button>
                  <button
                     className={classes.zone._6 + getClass(6)}
                     style={getStyle(6)}
                     disabled>
                     {current[6] ? current[6] : ""}
                  </button>
                  <button
                     className={classes.zone._7 + getClass(7)}
                     style={getStyle(7)}
                     disabled>
                     {current[7] ? current[7] : ""}
                  </button>
                  <span className={classes.zone.arrow}>
                     <img src={arrow} alt='<' />
                     <img src={arrow} alt='<' />
                  </span>
               </div>

               {/* Right-side free zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._8 + getClass(8)}
                     style={getStyle(8)}
                     disabled>
                     {current[8] ? current[8] : ""}
                  </button>
                  <button
                     className={classes.zone._9 + getClass(9)}
                     style={getStyle(9)}
                     disabled>
                     {current[9] ? current[9] : ""}
                  </button>
               </div>

               {/* Right-side sector zones */}
               <div className={classes.zone.group}>
                  <button
                     className={classes.zone._10 + getClass(10)}
                     style={getStyle(10)}
                     disabled>
                     {current[10] ? current[10] : ""}
                  </button>
                  <button
                     className={classes.zone._11 + getClass(11)}
                     style={getStyle(11)}
                     disabled>
                     {current[11] ? current[11] : ""}
                  </button>
                  <button
                     className={classes.zone._12 + getClass(12)}
                     style={getStyle(12)}
                     disabled>
                     {current[12] ? current[12] : ""}
                  </button>
               </div>
            </div>

            {/* Mode-switching buttons */}
            <div className={classes.heatmapButtons}>
               <Button
                  active={mode === "Outer"}
                  outline
                  size='lg'
                  color='heatmap-outer'
                  style={styles.button}
                  onClick={() => changeMode("Outer")}>
                  Outer
               </Button>
               <Button
                  active={mode === "Inner"}
                  outline
                  size='lg'
                  color='heatmap-inner'
                  style={styles.button}
                  onClick={() => changeMode("Inner")}>
                  Inner
               </Button>
               <Button
                  active={mode === "Pickup"}
                  outline
                  size='lg'
                  color='heatmap-pickup'
                  style={styles.button}
                  onClick={() => changeMode("Pickup")}>
                  Pickup
               </Button>
            </div>
         </ModalBody>
      </Modal>
   );
};

/// Inline class manager
const classes = {
   modalHeader: "bg-playback text-back",
   modalBody: "bg-back",
   modalClose: "text-back",

   // Field buttons
   field: "heatmapField mb-4",
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

   // Field button background colors
   heatmapGrey: "bg-heatmap-grey",
   heatmapOuter: "bg-heatmap-outer",
   heatmapInner: "bg-heatmap-inner",
   heatmapPickup: "bg-heatmap-pickup",

   heatmapButtons: "heatmapButtons",
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
};

/// Export
export default HeatmapModal;
