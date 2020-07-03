import React, { Fragment } from "react";
import QueryString from "query-string";
import PropTypes from "prop-types";

const Login = ({ location: { search } }) => {
   const query = QueryString.parse(search);
   return (
      <Fragment>
         <h1>Hello this is a test page</h1>
         <p></p>
      </Fragment>
   );
};

Login.propTypes = {
   location: PropTypes.object, // URL Details
};

export default Login;
