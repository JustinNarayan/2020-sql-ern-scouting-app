import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Table } from "reactstrap";
import { authPageCheck } from "../../checkAuth";
import AddComp from "./AddComp";

const Home = () => {
   // Set state variables
   const [authing, setAuthing] = useState(true);
   const [loading, setLoading] = useState(false);
   const [addMessages, setAddMessages] = useState([]);
   const auth = useStoreState((state) => state.auth);
   const comps = useStoreState((state) => state.comps);

   // Bring in commands
   const getComps = useStoreActions((actions) => actions.getComps);
   const addComp = useStoreActions((actions) => actions.addComp);

   // Define methods
   useEffect(() => {
      authPageCheck(auth, setAuthing);

      getComps();
   }, [auth, getComps]);

   const onAddCompSubmit = async (e, competitionName) => {
      e.preventDefault();

      if (!competitionName) {
         setAddMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else {
         setLoading(true);
         const res = await addComp({ competitionName });
         setAddMessages([{ text: res.message, type: res.type }]);
         setLoading(false);
      }
   };

   // Render Component
   return (
      <div className={classes.container} style={styles.container}>
         <Table borderless className={classes.table}>
            <thead>
               <tr className={classes.tableHead}>
                  <th colSpan='7'>
                     Competitions
                     <AddComp
                        onSubmit={onAddCompSubmit}
                        loading={loading}
                        messages={addMessages}
                     />
                  </th>
               </tr>
            </thead>
            <tbody>
               {authing
                  ? null
                  : comps.map((comp, index) => (
                       <tr key={comp.ID}>
                          <td className={classes.compName}>
                             {comp.CompetitionName}
                          </td>
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
      </div>
   );
};

const classes = {
   container: "p-0 mx-3",
   table: "compTable p-0 text-back",
   tableHead: "bg-comp-table-head",
   compName: "compName",
   link: "link",
};

const styles = {};

export default Home;
