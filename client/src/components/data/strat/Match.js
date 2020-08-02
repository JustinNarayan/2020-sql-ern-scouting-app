/// Modules
import React, { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import QueryString from "query-string";
import PropTypes from "prop-types";

/// Components
import DataTable from "./table/DataTable";

/**
 * Match Component
 * ---------------
 * Present DataTable for all bots in a match at a competition
 */
const Match = ({ query }) => {
   /**
    * Set query and store state variables
    */
   const compID = QueryString.parse(query).compID;
   const matchNumber = QueryString.parse(query).matchNumber;
   const comp = useStoreState((state) => state.comp); // The getComp action is called from dataTable to keep calls in one place

   /**
    * Handle life cycle to check query
    */
   useEffect(() => {
      if (!matchNumber) window.location.href = "/home";
   }, [matchNumber]);

   /**
    * Render component
    */
   return (
      <div className={classes.container}>
         {/* Title text */}
         <h1 className={classes.title}>Match {matchNumber}</h1>
         <h5 className={classes.compname}>@ {comp.CompetitionName}</h5>

         {/* Generate table by MatchNumber */}
         <DataTable
            compID={compID}
            filter={(data) =>
               data
                  .filter((row) => row.MatchNumber === matchNumber)
                  .sort((a, b) => a.RobotStation.localeCompare(b.RobotStation))
            }
            exclude={{ matchNumber: 1 }}
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
Match.propTypes = {
   query: PropTypes.string, // URL search details
};

/// Export
export default Match;
