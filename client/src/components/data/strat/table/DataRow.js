/// Modules
import React, { Fragment, useState } from "react";

/// Components
import ActionsModal from "./modals/ActionsModal";
import PlaybackModal from "./modals/PlaybackModal";
import HeatmapModal from "./modals/HeatmapModal";

/// Assets
import playback from "bootstrap-icons/icons/play-fill.svg";
import heatmap from "bootstrap-icons/icons/bullseye.svg";
import actions from "bootstrap-icons/icons/clipboard-data.svg";

/**
 * DataRow Component
 * -----------------
 * Generate a table-row based on match data
 */
const DataRow = ({
   navigate,
   row,
   exclude,
   comps,
   loading,
   messages,
   overwriteModals,
   clearMessages,
   onSubmit,
}) => {
   /**
    * Set dynamic state variables
    */
   const [actionsModal, setActionsModal] = useState(false);
   const [playbackModal, setPlaybackModal] = useState(false);
   const [heatmapModal, setHeatmapModal] = useState(false);

   /**
    * Define all component methods
    */
   /// Toggle if the ActionsModal is shown
   const toggleActionsModal = () => {
      setActionsModal(!actionsModal);
      clearMessages();
   };

   /// Toggle if the PlaybackModal is shown
   const togglePlaybackModal = () => setPlaybackModal(!playbackModal);

   /// Toggle if the HeatmapModal is shown
   const toggleHeatmapModal = () => setHeatmapModal(!heatmapModal);

   return (
      <Fragment>
         {/* Change class for background-color if row is updated */}
         <tr className={row.Updated ? "updated" : ""}>
            {/* Generate table-cells with data and relevant links */}
            {!exclude.teamNumber && (
               <td
                  className={classes.link}
                  onClick={() => navigate("team", row.TeamNumber)}>
                  {row.TeamNumber}
               </td>
            )}
            {!exclude.matchNumber && (
               <td
                  className={classes.link}
                  onClick={() => navigate("match", row.MatchNumber)}>
                  {row.MatchNumber}
               </td>
            )}
            {!exclude.robotStation && (
               <td
                  className={
                     row.RobotStation.slice(0, 1) === "R"
                        ? classes.red
                        : classes.blue
                  }>
                  {row.RobotStation}
               </td>
            )}
            {!exclude.playback && (
               <td onClick={() => togglePlaybackModal()}>
                  <img
                     className={classes.icons}
                     src={playback}
                     alt='Playback'
                  />
               </td>
            )}
            <td onClick={() => toggleHeatmapModal()}>
               <img className={classes.icons} src={heatmap} alt='Heatmap' />
            </td>
            <td>{+row.CrossLine.toFixed(2)}</td>
            <td>
               {+row.InnerAuto.toFixed(2)}
               <br />
               {+row.OuterAuto.toFixed(2)}
               <br />
               {+row.BottomAuto.toFixed(2)}
            </td>
            <td>
               {+row.InnerAll.toFixed(2)}
               <br />
               {+row.OuterAll.toFixed(2)}
               <br />
               {+row.BottomAll.toFixed(2)}
            </td>
            <td>{+row.Pickups.toFixed(2)}</td>
            <td>{+row.TimeDefended.toFixed(2)}</td>
            <td>{+row.TimeDefending.toFixed(2)}</td>
            <td className={`def${Math.floor(row.DefenseQuality + 0.5)}`}>
               {+row.DefenseQuality.toFixed(2)}
               <br />
               {row.ID
                  ? row.DefenseQuality === 0
                     ? "No Defense"
                     : row.DefenseQuality === 1
                     ? "Negligible"
                     : row.DefenseQuality === 2
                     ? "Weak"
                     : row.DefenseQuality === 3
                     ? "Effective"
                     : "Unbreakable"
                  : ""}
            </td>
            <td>{+row.TimeMal.toFixed(2)}</td>
            <td>
               {+row.Endgame.toFixed(2)}
               <br />
               {row.ID
                  ? row.Endgame === 0
                     ? "On Field"
                     : row.Endgame === 1
                     ? "Parked"
                     : "Hanged"
                  : ""}
            </td>
            {!exclude.comments && <td>{row.Comments}</td>}
            {!exclude.scoutName && <td>{row.ScoutName}</td>}
            {!exclude.actions && (
               <td onClick={() => toggleActionsModal()}>
                  <img className={classes.icons} src={actions} alt='Actions' />
               </td>
            )}
         </tr>

         {/* ActionsModal allows competition switching, data updating, clearing, reinstating, and deleting */}
         <ActionsModal
            modal={actionsModal}
            toggleModal={toggleActionsModal}
            messages={messages}
            overwriteModals={overwriteModals}
            clearMessages={clearMessages}
            row={row}
            comps={comps}
            onSubmit={onSubmit}
            loading={loading}
         />

         {/* PlaybackModal turns events array into viewable playback */}
         <PlaybackModal
            modal={playbackModal}
            toggleModal={togglePlaybackModal}
            row={row}
            events={JSON.parse(row.Events || "[]")}
         />

         {/* HeatmapModal turns heatmaps into viewable representations */}
         <HeatmapModal
            modal={heatmapModal}
            toggleModal={toggleHeatmapModal}
            row={row}
            outerHeatmap={JSON.parse(row.OuterHeatmap).map(
               (val) => +val.toFixed(2)
            )}
            innerHeatmap={JSON.parse(row.InnerHeatmap).map(
               (val) => +val.toFixed(2)
            )}
            pickupHeatmap={JSON.parse(row.PickupHeatmap).map(
               (val) => +val.toFixed(2)
            )}
         />
      </Fragment>
   );
};

/// Inline class manager
const classes = {
   icons: "icons",
   red: "red",
   blue: "blue",
   link: "link",
};

/// Export
export default DataRow;
