import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useStoreActions } from "easy-peasy";
import { Table } from "reactstrap";
import AddComp from "./AddComp";

const Comps = ({ comps }) => {
   const onAddCompSubmit = (e, newCompName) => {
      e.preventDefault();
      console.log(newCompName);
   };

   return (
      <Table borderless className={classes.table}>
         <thead>
            <tr className={classes.tableHead}>
               <th colSpan='7'>
                  Competitions
                  <AddComp onSubmit={onAddCompSubmit} />
               </th>
            </tr>
         </thead>
         <tbody>
            {comps.map((comp, index) => (
               <tr key={comp.ID}>
                  <td className={classes.compName}>{comp.CompetitionName}</td>
                  <td className={classes.link}>Teams</td>
                  <td className={classes.link}>Matches</td>
                  <td className={classes.link}>Scout</td>
                  <td className={classes.link}>Pit Scout</td>
                  <td className={classes.link}>Pending Data</td>
                  <td className={classes.link}>Actions</td>
               </tr>
            ))}
         </tbody>
      </Table>
   );
};

const classes = {
   table: "compTable p-0 text-back",
   tableHead: "bg-comp-table-head",
   compName: "compName",
   link: "link",
};

const styles = {};

export default Comps;
