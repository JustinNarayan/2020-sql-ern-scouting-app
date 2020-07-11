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

const User = ({ mode, query }) => {
   // Set state variables
   const [messages, setMessages] = useState([]);
   const [username, setUsername] = useState("");
   const [teamNumber, setTeamNumber] = useState();
   const maxTeamNumber = 8427;
   const [password, setPassword] = useState("");
   const [passwordConfirm, setPasswordConfirm] = useState("");
   const [adminKey, setAdminKey] = useState("");
   const [adminKeyConfirm, setAdminKeyConfirm] = useState("");
   const [email, setEmail] = useState("");
   const [verifyID] = useState(QueryString.parse(query).verifyID);
   const [loading, setLoading] = useState(false);

   // Bring in commands
   const login = useStoreActions((actions) => actions.login);
   const register = useStoreActions((actions) => actions.register);
   const verify = useStoreActions((actions) => actions.verify);

   // Define methods
   useEffect(() => {
      // Check if verify
      if (mode === "Verify") {
         if (!verifyID) {
            setMessages([{ text: "Invalid verification link", type: "bad" }]);
         }
      }
      //eslint-disable-next-line
   }, []);

   const handleRedirect = () => {
      setMessages([]);
   };

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

   const onLogin = async (e) => {
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

         // If it was a good message, the component would unmount upon redirect
         if (res.type === "bad") {
            setMessages([res]);
            setLoading(false);
         }
      }
   };

   const onRegister = async (e) => {
      setMessages([]);
      const errors = [];
      // Check for errors
      if (
         !username ||
         !password ||
         !passwordConfirm ||
         !adminKey ||
         !adminKeyConfirm ||
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
         if (password !== passwordConfirm) {
            errors.push({ text: "Passwords do not match", type: "bad" });
         }
         if (adminKey !== adminKeyConfirm) {
            errors.push({ text: "Admin keys do not match", type: "bad" });
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
            password,
            adminKey,
            email,
            teamNumber,
         });
         setLoading(false);
         setMessages([{ text: res.message, type: res.type }]);
      }
   };

   const onVerify = async (e) => {
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

         // If either was a good message, the component would unmount upon redirect
         if (res.type === "bad" || (nextRes.type && nextRes.type === "bad")) {
            setMessages(alerts);
            setLoading(false);
         }
      }
   };

   /// Handle authentication
   const authenticate = async (user) => {
      const auth = await login(user);
      /// SET AUTHORIZATION TOKEN IN SESSION STORAGE
      if (auth.token) {
         sessionStorage.setItem("username", user.username);
         sessionStorage.setItem("token", auth.token);
         window.location.href = "/home";
      }
      return { text: auth.message, type: auth.type };
   };

   // Render Component
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
         <Form className={classes.form} onSubmit={onSubmit}>
            <CardBody className={classes.cardBody} style={styles.cardBody}>
               <FormGroup className={classes.formGroup}>
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
                  <Input
                     type='password'
                     autoComplete='new-password'
                     style={
                        mode === "Register" ? styles.input.left : styles.input
                     }
                     className={classes.input}
                     placeholder='Password'
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  {mode === "Register" ? (
                     <Input
                        type='password'
                        autoComplete='confirm-password'
                        style={styles.input.right}
                        className={classes.input}
                        placeholder='Confirm Password'
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                     />
                  ) : null}
               </FormGroup>
               {mode === "Register" ? (
                  <Fragment>
                     <FormGroup className={classes.formGroup}>
                        <Input
                           type='password'
                           autoComplete='new-admin-key'
                           style={styles.input.left}
                           className={classes.input}
                           placeholder='Admin Key'
                           onChange={(e) => setAdminKey(e.target.value)}
                        />
                        <Input
                           type='password'
                           autoComplete='confirm-admin-key'
                           style={styles.input.right}
                           className={classes.input}
                           placeholder='Confirm Admin Key'
                           onChange={(e) => setAdminKeyConfirm(e.target.value)}
                        />
                     </FormGroup>
                     <FormGroup className={classes.formGroup}>
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
      fontWeight: "300",
      fontSize: "30px",
      marginBottom: "20px",
   },
   formText: {
      marginTop: "16px",
      fontSize: "14px",
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

User.propTypes = {
   mode: PropTypes.string, //Type of user page
   query: PropTypes.string, // URL search details
};

export default User;
