/// Modules
import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

const HeatmapModal = ({
   modal,
   toggleModal,
   outerHeatmap,
   innerHeatmap,
   pickupHeatmap,
}) => {
   const [mode, setMode] = useState("Outer");

   return (
      <Modal isOpen={modal} size='xl'>
         <ModalHeader
            className={classes.modalHeader}
            style={styles.modalHeader}>
            {mode} Heatmap
         </ModalHeader>
         <ModalBody>
            <div className={classes.heatmapButtons}>
               <Button>Outer</Button>
               <Button>Inner</Button>
               <Button>Pickup</Button>
            </div>
            {/* Close button */}
            <Button
               color='comp-table-head'
               className={classes.modalSubmit}
               style={styles.button}
               block
               outline
               size='md'
               onClick={() => toggleModal()}>
               Close
            </Button>
         </ModalBody>
      </Modal>
   );
};

const classes = {
   modalHeader: "bg-comp-table-head text-back",
   modalBody: "bg-back",
   heatmapButtons: "heatmapButtons",
   modalSubmit: "modalSubmit",
};

const styles = {
   modalHeader: {
      paddingLeft: "22px",
   },
   button: {
      fontWeight: "400",
   },
};

export default HeatmapModal;
