import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
   Table,
   Modal,
   ModalHeader,
   Alert,
   ModalBody,
   Button,
} from "reactstrap";
import { authPageCheck } from "../../utils/checkAuth";
import AddComp from "./AddComp";
import Comp from "./Comp";

const Home = () => {
   // Set state variables
   const [authing, setAuthing] = useState(true);
   const [loading, setLoading] = useState(false);
   const [addMessages, setAddMessages] = useState([]);
   const [editMessages, setEditMessages] = useState([]);
   const [deleteMessages, setDeleteMessages] = useState([]);
   const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
   const auth = useStoreState((state) => state.auth);
   const comps = useStoreState((state) => state.comps);

   // Bring in commands
   const getComps = useStoreActions((actions) => actions.getComps);
   const addComp = useStoreActions((actions) => actions.addComp);
   const editComp = useStoreActions((actions) => actions.editComp);
   const deleteComp = useStoreActions((actions) => actions.deleteComp);

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

   const onDeleteCompSubmit = async (e, comp, checked) => {
      e.preventDefault();
      if (loading) return;

      if (!checked) {
         setDeleteMessages([
            {
               text: "Delete aborted; understanding boxes not checked",
               type: "bad",
            },
         ]);
      } else {
         setLoading(true);
         const res = await deleteComp(comp.ID);
         setDeleteMessages([
            {
               text: `${res.message}${
                  res.type === "good" ? comp.CompetitionName : "" // Will display 'Successfully deleted <CompetitionName>' or a regular error message
               }`,
               type: res.type,
            },
         ]);
         setLoading(false);

         // The comp modal will unmount so open this modal to present a success message
         if (res.type === "good") toggleDeleteSuccessModal();
      }
   };

   const toggleDeleteSuccessModal = () =>
      setDeleteSuccessModal(!deleteSuccessModal);

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
         <Modal
            isOpen={deleteSuccessModal}
            toggle={toggleDeleteSuccessModal}
            size='md'>
            <ModalHeader
               className={classes.modalHeaderDelete}
               style={styles.modalHeader}>
               Delete Success
               <Button
                  color='transparent'
                  className={classes.modalClose}
                  style={styles.modalClose}
                  onClick={toggleDeleteSuccessModal}>
                  &times;
               </Button>
            </ModalHeader>
            <ModalBody>
               {deleteMessages.map((message) => (
                  <Alert
                     key={message.text}
                     color={
                        message.type === "good"
                           ? "message-good"
                           : "message-error"
                     }
                     className={classes.alert}>
                     {message.text}
                  </Alert>
               ))}
               <Button
                  color='comp-table-head'
                  className={classes.modalSubmit}
                  style={styles.button}
                  block
                  outline
                  size='md'
                  onClick={toggleDeleteSuccessModal}>
                  OK
               </Button>
            </ModalBody>
         </Modal>
      </div>
   );
};

const classes = {
   container: "p-0 mx-3",
   table: "compTable p-0 text-back",
   tableHead: "bg-comp-table-head",
   modalHeaderDelete: "bg-message-error text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   modalSubmit: "modalSubmit",
};

const styles = {
   modalHeader: {
      paddingLeft: "22px",
   },
   modalClose: {
      padding: "0px",
      float: "right",
      fontSize: "26px",
      border: "0",
      right: "20px",
      top: "10px",
      position: "absolute",
      height: "0",
   },
   button: {
      fontWeight: "400",
   },
};

export default Home;
