/// Modules
import React from "react";
import { useStoreState } from "easy-peasy";
import QueryString from "query-string";
import PropTypes from "prop-types";

/// Components
import DataTable from "./table/DataTable";

/**
 * Teams Component
 * ---------------
 * Present DataTable for all team averages at a competition
 */
const Teams = ({ query }) => {
   /**
    * Set query and store state variables
    */
   const compID = QueryString.parse(query).compID;
   const comp = useStoreState((state) => state.comp); // The getComp action is called from dataTable to keep calls in one place

   /**
    * Render component
    */
   return (
      <div className={classes.container}>
         {/* Title text */}
         <h1 className={classes.title}>Teams</h1>
         <h5 className={classes.compname}>@ {comp.CompetitionName}</h5>

         {/* Generate table by parsing matches into averages */}
         <DataTable
            compID={compID}
            filter={(data) => {
               // Generate unique list of all teams
               const teams = [...new Set(data.map((row) => row.TeamNumber))];

               const averages = [];

               teams.forEach((team) => {
                  // Generate object for DataTable with all total values => average values
                  const average = {
                     Updated: 1,
                     CompetitionID: parseInt(compID),
                     TeamNumber: team,
                     OuterHeatmap: new Array(13).fill(0),
                     InnerHeatmap: new Array(13).fill(0),
                     PickupHeatmap: new Array(13).fill(0),
                     CrossLine: 0,
                     BottomAuto: 0,
                     OuterAuto: 0,
                     InnerAuto: 0,
                     BottomAll: 0,
                     OuterAll: 0,
                     InnerAll: 0,
                     Pickups: 0,
                     TimeDefended: 0,
                     DefenseQuality: 0,
                     TimeDefending: 0,
                     TimeMal: 0,
                     Endgame: 0,
                     matchCount: 0,
                     defenseCount: 0,
                  };

                  // Retrieve this team's matches
                  const matches = data.filter(
                     (row) => row.TeamNumber === team && row.Updated
                  );

                  // Increment totals in average based on current match
                  matches.forEach((match) => {
                     JSON.parse(match.OuterHeatmap).map(
                        (value, zone) => (average.OuterHeatmap[zone] += value)
                     );
                     JSON.parse(match.InnerHeatmap).map(
                        (value, zone) => (average.InnerHeatmap[zone] += value)
                     );
                     JSON.parse(match.PickupHeatmap).map(
                        (value, zone) => (average.PickupHeatmap[zone] += value)
                     );
                     average.CrossLine += match.CrossLine;
                     average.BottomAuto += match.BottomAuto;
                     average.OuterAuto += match.OuterAuto;
                     average.InnerAuto += match.InnerAuto;
                     average.BottomAll += match.BottomAll;
                     average.OuterAll += match.OuterAll;
                     average.InnerAll += match.InnerAll;
                     average.Pickups += match.Pickups;
                     average.TimeDefended += match.TimeDefended;
                     average.TimeDefending += match.TimeDefending;
                     average.DefenseQuality += match.DefenseQuality;
                     average.TimeMal += match.TimeMal;
                     average.Endgame += match.Endgame;

                     average.matchCount++;
                     if (match.TimeDefending) average.defenseCount++;
                  });

                  // Divide variables in average object by match/defense count
                  average.OuterHeatmap = average.OuterHeatmap.map(
                     (value) => (value /= average.matchCount)
                  );
                  average.InnerHeatmap = average.InnerHeatmap.map(
                     (value) => (value /= average.matchCount)
                  );
                  average.PickupHeatmap = average.PickupHeatmap.map(
                     (value) => (value /= average.matchCount)
                  );
                  average.CrossLine /= average.matchCount;
                  average.BottomAuto /= average.matchCount;
                  average.OuterAuto /= average.matchCount;
                  average.InnerAuto /= average.matchCount;
                  average.BottomAll /= average.matchCount;
                  average.OuterAll /= average.matchCount;
                  average.InnerAll /= average.matchCount;
                  average.Pickups /= average.matchCount;
                  if (average.TimeDefended)
                     average.TimeDefended /= average.matchCount;
                  if (average.defenseCount)
                     average.TimeDefending /= average.defenseCount;
                  if (average.defenseCount)
                     average.DefenseQuality /= average.defenseCount;
                  average.TimeMal /= average.matchCount;
                  average.Endgame /= average.matchCount;

                  average.OuterHeatmap = JSON.stringify(average.OuterHeatmap);
                  average.InnerHeatmap = JSON.stringify(average.InnerHeatmap);
                  average.PickupHeatmap = JSON.stringify(average.PickupHeatmap);

                  // Add this team's average to array of averages
                  averages.push(average);
               });

               return averages;
            }}
            exclude={{
               matchNumber: 1,
               robotStation: 1,
               playback: 1,
               comments: 1,
               scoutName: 1,
               actions: 1,
            }}
         />
      </div>
   );
};

/// Inline class manager
const classes = {
   container: "p-0 mx-3",
   title: "mb-2 mt-2 text-table-text",
   compname: "mb-4 font-weight-normal font-italic text-table-text",
};

/// Prop Types
Teams.propTypes = {
   query: PropTypes.string, // URL search details
};

/// Export
export default Teams;
