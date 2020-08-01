/// Modules
import React, { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import QueryString from "query-string";

/// Components
import DataTable from "./table/DataTable";

const Team = ({ query }) => {
   // State
   const compID = QueryString.parse(query).compID;
   const teamNumber = QueryString.parse(query).teamNumber;
   const comp = useStoreState((state) => state.comp); // The getComp action is called from dataTable to keep calls in one place

   useEffect(() => {
      if (!teamNumber) window.location.href = "/home";
   }, [teamNumber]);

   return (
      <div className={classes.container}>
         {/* Title text */}
         <h1 className={classes.title}>Team {teamNumber}</h1>
         <h5 className={classes.compname}>@ {comp.CompetitionName}</h5>

         <DataTable
            compID={compID}
            filter={(data) =>
               data
                  .filter((row) => row.TeamNumber === parseInt(teamNumber))
                  .sort((a, b) => a.ID - b.ID)
            }
            exclude={{ teamNumber: 1, robotStation: 1 }}
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

export default Team;
