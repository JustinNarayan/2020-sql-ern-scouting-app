import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Table } from "reactstrap";
import { authPageCheck } from "../../checkAuth";
import AddComp from "./AddComp";
import Comp from "./Comp";

const Home = () => {
   // Set state variables
   const [authing, setAuthing] = useState(true);
   const [loading, setLoading] = useState(false);
   const [addMessages, setAddMessages] = useState([]);
   const [editMessages, setEditMessages] = useState([]);
   const [deleteMessages, setDeleteMessages] = useState([]);
   const auth = useStoreState((state) => state.auth);
   const comps = useStoreState((state) => state.comps);

   // Bring in commands
   const getComps = useStoreActions((actions) => actions.getComps);
   const addComp = useStoreActions((actions) => actions.addComp);
   const editComp = useStoreActions((actions) => actions.editComp);

   // Define methods
   useEffect(() => {
      authPageCheck(auth, setAuthing);

      getComps();
   }, [auth, getComps]);

   const onAddCompSubmit = async (e, competitionName) => {
      e.preventDefault();
      if (loading) return;

      if (!competitionName) {
         setAddMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else {
         setLoading(true);
         const res = await addComp({ competitionName });
         setAddMessages([{ text: res.message, type: res.type }]);
         setLoading(false);
      }
   };

   const onEditCompSubmit = async (e, comp, competitionName) => {
      e.preventDefault();
      if (loading) return;

      if (!competitionName) {
         setEditMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else if (competitionName === comp.CompetitionName) {
         setEditMessages([
            {
               text: "The edited name is the same as the original name",
               type: "bad",
            },
         ]);
      } else {
         setLoading(true);
         const res = await editComp({ id: comp.ID, competitionName });
         setEditMessages([{ text: res.message, type: res.type }]);
         setLoading(false);
      }
   };

   const onDeleteCompSubmit = async (e, id) => {
      e.preventDefault();
      if (loading) return;

      console.log(e);
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
                        clearMessages={() => setAddMessages([])}
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
                       <Comp
                          key={comp.ID}
                          comp={comp}
                          onEditSubmit={onEditCompSubmit}
                          onDeleteSubmit={onDeleteCompSubmit}
                          clearMessages={() => {
                             setEditMessages([]);
                             setDeleteMessages([]);
                          }}
                          loading={loading}
                          editMessages={editMessages}
                          deleteMessages={deleteMessages}
                       />
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
};

const styles = {};

export default Home;
