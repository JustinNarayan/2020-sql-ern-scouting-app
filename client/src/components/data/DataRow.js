/// Modules
import React, { Fragment, useState } from "react";

/// Components
import HeatmapModal from "./HeatmapModal";

/// Assets
import playback from "bootstrap-icons/icons/play-fill.svg";
import heatmap from "bootstrap-icons/icons/bullseye.svg";

const DataRow = ({ row, exclude }) => {
   const [heatmapModal, setHeatmapModal] = useState(false);

   const toggleHeatmapModal = () => setHeatmapModal(!heatmapModal);

   return (
      <Fragment>
         <tr className={row.Updated ? "updated" : ""}>
            {!exclude.teamNumber && <td>{row.TeamNumber}</td>}
            {!exclude.matchNumber && <td>{row.MatchNumber}</td>}
            {!exclude.robotStation && <td>{row.RobotStation}</td>}
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
            {!exclude.actions && <td>Actions</td>}
         </tr>

         <HeatmapModal
            modal={heatmapModal}
            toggleModal={toggleHeatmapModal}
            outerHeatmap={row.outerHeatmap}
            innerHeatmap={row.innerHeatmap}
            pickupHeatmap={row.pickupHeatmap}
         />
      </Fragment>
   );
};

const classes = {
   icons: "icons",
};

export default DataRow;
