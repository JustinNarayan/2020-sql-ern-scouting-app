/// Modules
import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useStoreActions } from "easy-peasy";
import {
   Card,
   Label,
   Alert,
   CardBody,
   Form,
   FormGroup,
   Input,
   Button,
   Spinner,
} from "reactstrap";
import QueryString from "query-string";
import PropTypes from "prop-types";
import validator from "email-validator";

/**
 * User Component
 * --------------
 * Allows users to login, register, or verify
 */
const User = ({ mode, query }) => {
   /**
    * Set static and dynamic state variables
    */
   const maxTeamNumber = 8427;
   const verifyID = QueryString.parse(query).verifyID;
   const timeBeforeRedirect = 250; // A timeout to display a message before the redirect

   const [messages, setMessages] = useState([]);
   const [username, setUsername] = useState("");
   const [teamNumber, setTeamNumber] = useState();
   const [password, setPassword] = useState("");
   const [scoutPassword, setScoutPassword] = useState("");
   const [scoutPasswordConfirm, setScoutPasswordConfirm] = useState("");
   const [adminPassword, setAdminPassword] = useState("");
   const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("");
   const [email, setEmail] = useState("");
   const [loading, setLoading] = useState(false);

   /**
    * Bring in easy-peasy store thunks/actions
    */
   const login = useStoreActions((actions) => actions.login);
   const register = useStoreActions((actions) => actions.register);
   const verify = useStoreActions((actions) => actions.verify);

   /**
    * Handle life cycle
    */
   useEffect(() => {
      if (mode === "Verify") {
         if (!verifyID) {
            window.location.href = "/";
         }
      }
      //eslint-disable-next-line
   }, []);

   /**
    * Define all component methods
    */
   /// IN PROGRESS
   const handleRedirect = () => {
      setMessages([]);
   };

   /// Call relevant submission method
   const onSubmit = (e) => {
      e.preventDefault();
      if (loading) return;
      switch (mode) {
         case "Register":
            onRegister();
            break;
         case "Verify":
            onVerify();
            break;
         default:
            onLogin();
            break;
      }
   };

   /// Manage login submission
   const onLogin = async () => {
      if (!username || !password) {
         setMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else if (!username.match(/^[0-9a-z]+$/)) {
         setMessages([
            {
               text: "Usernames must be alphanumeric",
               type: "bad",
            },
         ]);
      } else {
         setLoading(true);
         const res = await authenticate({ username, password });
         setMessages([res]);
         setLoading(false);
      }
   };

   /// Manage register submission
   const onRegister = async () => {
      setMessages([]);
      const errors = [];
      // Check for errors
      if (
         !username ||
         !scoutPassword ||
         !scoutPasswordConfirm ||
         !adminPassword ||
         !adminPasswordConfirm ||
         !teamNumber
      ) {
         errors.push({ text: "Please fill out all fields", type: "bad" });
      } else {
         if (!username.match(/^[0-9a-z]+$/)) {
            errors.push({
               text: "Usernames must be alphanumeric",
               type: "bad",
            });
         }
         if (!validator.validate(email)) {
            errors.push({ text: "Invalid email address", type: "bad" });
         }
         if (scoutPassword !== scoutPasswordConfirm) {
            errors.push({ text: "Scout passwords do not match", type: "bad" });
         }
         if (adminPassword !== adminPasswordConfirm) {
            errors.push({ text: "Admin passwords do not match", type: "bad" });
         }
         if (teamNumber < 1 || teamNumber > maxTeamNumber) {
            errors.push({ text: "Invalid team number", type: "bad" });
         }
      }
      // Has Errors
      if (errors.length > 0) {
         setMessages(errors);
         return;
      } else {
         setLoading(true);
         const res = await register({
            username,
            scoutPassword,
            adminPassword,
            email,
            teamNumber,
         });
         setLoading(false);
         setMessages([{ text: res.message, type: res.type }]);
      }
   };

   /// Manage verify submission
   const onVerify = async () => {
      if (!username || !password) {
         setMessages([{ text: "Please fill out all fields", type: "bad" }]);
      } else {
         const alerts = [];
         setLoading(true);
         const res = await verify({ username, password, verifyID });
         alerts.push({ text: res.message, type: res.type });

         // Login
         let nextRes;
         if (res.type === "good") {
            nextRes = await authenticate({ username, password });
            alerts.push(nextRes);
         }
         setMessages(alerts);
         setLoading(false);
      }
   };

   /// Handle authentication
   const authenticate = async (user) => {
      const auth = await login(user);
      /// SET AUTHORIZATION TOKEN IN SESSION STORAGE
      if (auth.token) {
         localStorage.setItem("username", user.username);
         localStorage.setItem("token", auth.token);
         setTimeout(() => (window.location.href = "/home"), timeBeforeRedirect);
      }
      return { text: auth.message, type: auth.type };
   };

   /**
    * Render component
    */
   return (
      <Card className={classes.card} style={styles.card}>
         <Label
            className={classes.labelTitle}
            style={styles.labelTitle}
            for='formUsername'>
            TEAM 7558 SCOUTING APP
         </Label>
         {messages.map((message) => (
            <Alert
               key={message.text}
               color={
                  message.type === "good" ? "message-good" : "message-error"
               }
               className={classes.alert}>
               {message.text}
            </Alert>
         ))}
         {/* Submission form recycles certain fields between Login/Register/Verify */}
         <Form className={classes.form} onSubmit={onSubmit}>
            <CardBody className={classes.cardBody} style={styles.cardBody}>
               <FormGroup className={classes.formGroup}>
                  {/* Username */}
                  <Input
                     type='text'
                     id='username'
                     autoComplete='username'
                     style={
                        mode === "Register"
                           ? styles.input.left.big
                           : styles.input
                     }
                     className={classes.input}
                     placeholder='Username'
                     onChange={(e) => setUsername(e.target.value)}
                  />
                  {mode === "Register" ? (
                     /* Team Number */
                     <Input
                        type='number'
                        autoComplete='team-number'
                        style={styles.input.right.small}
                        className={classes.input}
                        placeholder='Team'
                        onChange={(e) => setTeamNumber(e.target.value)}
                     />
                  ) : null}
               </FormGroup>
               <FormGroup className={classes.formGroup}>
                  {mode === "Register" ? (
                     <Fragment>
                        {/* Scout Password */}
                        <Input
                           type='password'
                           autoComplete='new-scout-password'
                           style={styles.input.left}
                           className={classes.input}
                           placeholder='Scout Password'
                           onChange={(e) => setScoutPassword(e.target.value)}
                        />

                        {/* Confirm Scout Password */}
                        <Input
                           type='password'
                           autoComplete='confirm-scout-password'
                           style={styles.input.right}
                           className={classes.input}
                           placeholder='Confirm Scout Password'
                           onChange={(e) =>
                              setScoutPasswordConfirm(e.target.value)
                           }
                        />
                     </Fragment>
                  ) : (
                     /* Password (Login/Verify) */
                     <Input
                        type='password'
                        autoComplete='scout-or-admin-password'
                        style={styles.input}
                        className={classes.input}
                        placeholder={
                           mode === "Verify"
                              ? "Admin Password"
                              : "Scout or Admin Password"
                        }
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  )}
               </FormGroup>
               {mode === "Register" ? (
                  <Fragment>
                     <FormGroup className={classes.formGroup}>
                        {/* Admin Password */}
                        <Input
                           type='password'
                           autoComplete='new-admin-password'
                           style={styles.input.left}
                           className={classes.input}
                           placeholder='Admin Password'
                           onChange={(e) => setAdminPassword(e.target.value)}
                        />

                        {/* Confirm Admin Password */}
                        <Input
                           type='password'
                           autoComplete='confirm-admin-password'
                           style={styles.input.right}
                           className={classes.input}
                           placeholder='Confirm Admin Password'
                           onChange={(e) =>
                              setAdminPasswordConfirm(e.target.value)
                           }
                        />
                     </FormGroup>
                     <FormGroup className={classes.formGroup}>
                        {/* Email */}
                        <Input
                           type='email'
                           autoComplete='email'
                           style={styles.input}
                           className={classes.input}
                           placeholder='Email'
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </FormGroup>
                  </Fragment>
               ) : null}

               {/* Submit Button */}
               <Button
                  style={styles.button}
                  color='login-text'
                  block
                  size='lg'
                  outline>
                  {loading ? (
                     <Spinner
                        className={classes.spinner}
                        style={styles.spinner}
                        color='login-form'
                     />
                  ) : (
                     mode
                  )}
               </Button>

               {/* Small text to navigate between 'No Account?' and 'Have an Account?' */}
               <p className={classes.formText} style={styles.formText}>
                  {mode === "Register" ? (
                     <Fragment>
                        Have an account?{" "}
                        <Link
                           to='/'
                           onClick={handleRedirect}
                           className={classes.link}>
                           Login
                        </Link>
                     </Fragment>
                  ) : (
                     <Fragment>
                        No account?{" "}
                        <Link
                           to='/register'
                           onClick={handleRedirect}
                           className={classes.link}>
                           Register
                        </Link>
                     </Fragment>
                  )}
               </p>
            </CardBody>
         </Form>
      </Card>
   );
};

/// Inline class manager
const classes = {
   card: "bg-login-form text-center mx-auto shadow",
   labelTitle: "text-login-text",
   alert: "mb-4 py-2",
   cardBody: "p-0",
   formGroup: "mb-4",
   formText: "text-login-text mb-0",
   link: "text-back",
   input: "text-login-text bg-back",
   spinner: "bg-login-text",
};

/// Inline style manager
const styles = {
   card: {
      borderRadius: "12px",
      padding: "24px",
      width: "440px",
      marginTop: "64px",
   },
   cardBody: {
      borderRadius: "12px",
   },
   labelTitle: {
      fontWeight: "400",
      fontSize: "28px",
      marginBottom: "20px",
   },
   formText: {
      marginTop: "16px",
      fontSize: "14px",
      fontWeight: "500",
   },
   input: {
      left: {
         width: "48%",
         display: "inline",
         margin: "0%",
         marginRight: "2%",

         big: {
            width: "73%",
            display: "inline",
            margin: "0%",
            marginRight: "2%",
         },
      },
      right: {
         width: "48%",
         display: "inline",
         margin: "0%",
         marginLeft: "2%",

         small: {
            width: "23%",
            display: "inline",
            margin: "0%",
            marginLeft: "2%",
         },
      },
      fontWeight: "400",
   },
   button: {
      marginTop: "32px",
      fontWeight: "400",
   },
   spinner: {
      width: "1.5rem",
      height: "1.5rem",
   },
};

/// Prop Types
User.propTypes = {
   mode: PropTypes.string, // Type of user page
   query: PropTypes.string, // URL search details
};

/// Export
export default User;
