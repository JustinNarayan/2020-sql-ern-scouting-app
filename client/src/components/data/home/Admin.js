import React, { useState, Fragment } from "react";
import {
   Modal,
   ModalHeader,
   ModalBody,
   Alert,
   Form,
   FormGroup,
   Input,
   Button,
   Spinner,
} from "reactstrap";
// import adminLock from "bootstrap-icons/icons/shield-lock-fill.svg";
// import adminCheck from "bootstrap-icons/icons/shield-fill-check.svg";

const Admin = ({ onSubmit, clearMessages, loading, messages }) => {
   // Set state variables
   const [modal, setModal] = useState(false);
   const [adminKey, setAdminKey] = useState("");

   // Define methods
   const toggleModal = () => {
      setModal(!modal);
      setAdminKey("");
      clearMessages();
   };

   return <Fragment>Hello</Fragment>;
};

const classes = {
   plus: "plus",
   modalHeader: "bg-comp-table-head text-back",
   modalClose: "text-back",
   modalBody: "bg-back",
   alert: "mb-4 py-2 text-center",
   formGroup: "mb-4",
   input: "m-0 bg-back text-table-text",
   modalSubmit: "modalSubmit",
   spinner: "bg-comp-table-head",
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
   spinner: {
      width: "1.25rem",
      height: "1.25rem",
   },
};

export default Admin;
