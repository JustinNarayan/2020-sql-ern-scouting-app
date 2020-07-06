import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useStoreActions } from "easy-peasy";
import { Table } from "reactstrap";

const Comps = ({ comps }) => {
   return (
      <Table>
         <thead>
            <tr>
               <th>Competition Name</th>
               <th>Delete</th>
            </tr>
         </thead>
         <tbody>
            {comps.map((comp) => (
               <tr key={comp.ID}>
                  <td>{comp.CompetitionName}</td>
                  <td>{comp.Username}</td>
               </tr>
            ))}
         </tbody>
      </Table>
   );
};

export default Comps;
