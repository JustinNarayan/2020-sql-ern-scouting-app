/*eslint-disable*/
import React, { Fragment } from "react";
import adminEmpty from "bootstrap-icons/icons/shield.svg";
import adminCheck from "bootstrap-icons/icons/shield-fill-check.svg";

const Admin = ({ isAdmin }) => {
   return (
      <Fragment>
         <img
            className={isAdmin ? classes.none : classes.admin}
            src={adminEmpty}
            alt='Not Admin'
         />
         <img
            className={isAdmin ? classes.admin : classes.none}
            src={adminCheck}
            alt='Is Admin'
         />
      </Fragment>
   );
};

const classes = {
   admin: "admin",
   none: "none",
};

const styles = {};

export default Admin;
