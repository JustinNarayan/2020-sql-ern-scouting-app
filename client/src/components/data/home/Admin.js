/// Modules
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/// Assets
import adminEmpty from "bootstrap-icons/icons/shield.svg";
import adminCheck from "bootstrap-icons/icons/shield-fill-check.svg";

/**
 * Admin Component
 * ---------------
 * Changes shield icons as a visual indicator for current admin login status
 */
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

/// Inline class manager
const classes = {
   admin: "admin",
   none: "none",
};

/// Prop Types
Admin.propTypes = {
   isAdmin: PropTypes.bool, // Whether the user is verified as an admin
};

/// Export
export default Admin;
