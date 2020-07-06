import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useStoreActions } from "easy-peasy";
import { Table } from "reactstrap";

const Comps = ({ comps }) => {
   return (
      <Table borderless className={classes.table}>
         <thead>
            <tr className={classes.tableHead}>
               <th>Competition Name</th>
               <th>Delete</th>
            </tr>
         </thead>
         <tbody>
            {comps.map((comp, index) => (
               <tr
                  key={comp.ID}
                  className={
                     index % 2 ? classes.tableRowDark : classes.tableRowLight
                  }>
                  <td>{comp.CompetitionName}</td>
                  <td>{comp.Username}</td>
               </tr>
            ))}
         </tbody>
      </Table>
   );
};

const classes = {
   table: "compTable p-0 text-back",
   tableHead: "bg-comp-table-head",
   tableRowLight: "bg-comp-table-row-light",
   tableRowDark: "bg-comp-table-row-dark",
};

const styles = {};

export default Comps;
