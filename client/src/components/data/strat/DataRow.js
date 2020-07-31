/// Modules
import React, { Fragment, useState } from "react";

/// Components
import HeatmapModal from "./HeatmapModal";
import ActionsModal from "./ActionsModal";

/// Assets
import playback from "bootstrap-icons/icons/play-fill.svg";
import heatmap from "bootstrap-icons/icons/bullseye.svg";
import actions from "bootstrap-icons/icons/clipboard-data.svg";

const DataRow = ({
   row,
   exclude,
   comps,
   loading,
   messages,
   overwriteModals,
   clearMessages,
   onSubmit,
}) => {
   const [actionsModal, setActionsModal] = useState(false);
   const [heatmapModal, setHeatmapModal] = useState(false);

   const toggleActionsModal = () => {
      setActionsModal(!actionsModal);
      clearMessages();
   };

   const toggleHeatmapModal = () => setHeatmapModal(!heatmapModal);

   return (
      <Fragment>
         <tr className={row.Updated ? "updated" : ""}>
            {!exclude.teamNumber && <td>{row.TeamNumber}</td>}
            {!exclude.matchNumber && <td>{row.MatchNumber}</td>}
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
               <td>
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
            <td>{row.CrossLine}</td>
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
            </td>
            <td>{+row.TimeMal.toFixed(2)}</td>
            <td>{+row.Endgame.toFixed(2)}</td>
            {!exclude.comments && <td>{row.Comments}</td>}
            {!exclude.scoutName && <td>{row.ScoutName}</td>}
            {!exclude.actions && (
               <td onClick={() => toggleActionsModal()}>
                  <img className={classes.icons} src={actions} alt='Actions' />
               </td>
            )}
         </tr>

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

         <HeatmapModal
            modal={heatmapModal}
            toggleModal={toggleHeatmapModal}
            outerHeatmap={JSON.parse(row.OuterHeatmap)}
            innerHeatmap={JSON.parse(row.InnerHeatmap)}
            pickupHeatmap={JSON.parse(row.PickupHeatmap)}
         />
      </Fragment>
   );
};

const classes = {
   icons: "icons",
   red: "red",
   blue: "blue",
};

export default DataRow;
