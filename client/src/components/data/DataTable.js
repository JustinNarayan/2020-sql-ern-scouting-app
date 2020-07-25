/// Modules
import React from "react";
import { Table } from "reactstrap";

/// Components
import DataRow from "./DataRow";

/// Assets
import clock from "bootstrap-icons/icons/clock-history.svg";

const DataTable = ({ data, exclude }) => {
   return (
      <Table borderless className={classes.table}>
         <thead>
            <tr className={classes.tableHead}>
               {!exclude.teamNumber && <th>Team</th>}
               {!exclude.matchNumber && <th>Match</th>}
               {!exclude.robotStation && (
                  <th>
                     Robot
                     <br />
                     Station
                  </th>
               )}
               {!exclude.playback && <th>Playback</th>}
               <th>Heatmap</th>
               <th>
                  Cross
                  <br />
                  Line
               </th>
               <th>
                  Auto
                  <br />
                  Shots
               </th>
               <th>
                  Total
                  <br />
                  Shots
               </th>
               <th>Pickups</th>
               <th>
                  <img className={classes.clock} src={clock} alt='Time Spent' />
                  <br />
                  D'd (s)
               </th>
               <th>
                  <img className={classes.clock} src={clock} alt='Time Spent' />
                  <br />
                  D'ing (s)
               </th>
               <th>
                  Defense
                  <br />
                  Quality
               </th>
               <th>
                  <img className={classes.clock} src={clock} alt='Time Spent' />
                  <br />
                  Mal (s)
               </th>
               <th>Endgame</th>
               {!exclude.comments && <th className={classes.long}>Comments</th>}
               {!exclude.scoutName && (
                  <th>
                     Scout
                     <br />
                     Name
                  </th>
               )}
               {!exclude.actions && <th>Actions</th>}
            </tr>
         </thead>
         <tbody>
            {data.map((row) => (
               <DataRow
                  key={row.ID || row.TeamNumber} // For averages, there will not be an ID, but Team Number will be unique
                  row={row}
                  exclude={exclude}
               />
            ))}
         </tbody>
      </Table>
   );
};

/// Inline class manager
const classes = {
   table: "dataTable p-0 text-back",
   tableHead: "bg-data-table-head",
   long: "long",
   clock: "clock",
};

export default DataTable;
