/// Modules
import React, { Fragment } from "react";
import { Form, Input } from "reactstrap";

const PendingRow = ({ comps, comp, data }) => {
   // State

   return (
      <Fragment>
         <Form tag='tr'>
            <td>
               <Input type='select' className={classes.input}>
                  {comps.map((comp) => (
                     <option key={comp.ID}>{comp.CompetitionName}</option>
                  ))}
               </Input>
            </td>
            <td>
               <Input type='number' className={classes.short} min='0' />
            </td>
            <td>
               <Input type='text' className={classes.short} />
            </td>
            <td
               className={
                  data.RobotStation.slice(0, 1) === "R"
                     ? classes.red
                     : classes.blue
               }>
               <Input type='text' className={classes.short} />
            </td>
         </Form>
      </Fragment>
   );
};

const classes = {
   input: "input",
   short: "input short",
   red: "bg-light-red",
   blue: "bg-light-blue",
};

export default PendingRow;
