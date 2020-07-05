import React, { useState, Fragment } from "react";
import { useStoreActions } from "easy-peasy";
import {
   Card,
   Label,
   Alert,
   CardBody,
   Form,
   FormGroup,
   Button,
   Input,
} from "reactstrap";
import PropTypes from "prop-types";
import validator from "email-validator";

const User = ({ mode, query }) => {
   // Set state variable
   const [messages, setMessages] = useState([]);
   const [username, setUsername] = useState("");
   const [teamNumber, setTeamNumber] = useState();
   const maxTeamNumber = 8427;
   const [password, setPassword] = useState("");
   const [passwordConfirm, setPasswordConfirm] = useState("");
   const [adminKey, setAdminKey] = useState("");
   const [adminKeyConfirm, setAdminKeyConfirm] = useState("");
   const [email, setEmail] = useState("");

   // Bring in commands
   const login = useStoreActions((actions) => actions.login);
   const register = useStoreActions((actions) => actions.register);
   const verify = useStoreActions((actions) => actions.verify);

   // Define methods
   const onSubmit = (e) => {
      e.preventDefault();
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
      const auth = await login({ username, password });

      // Check for token
      if (auth.token) {
         /// SET AUTHORIZATION TOKEN IN SESSION STORAGE
         localStorage.setItem("token", auth.token);
         console.log(localStorage.getItem("token"));
      } else {
         // Send error message
         setMessages([{ text: auth.message, type: auth.type }]);
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
         const newUser = { username, password, adminKey, email, teamNumber };
         console.log(newUser);
         // Still may be more errors with database, like a repeated username
      }
   };

   const onVerify = async (e) => {
      console.log("Verify");
   };

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
               color={message.type === "good" ? "login-good" : "login-error"}
               className={classes.alert}>
               {message.text}
            </Alert>
         ))}
         <Form className={classes.form} onSubmit={onSubmit}>
            <CardBody className={classes.cardBody} style={styles.cardBody}>
               <FormGroup className={classes.formGroup}>
                  <Input
                     type='text'
                     name='username'
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
                        name='teamNumber'
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
                     name='password'
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
                        name='passwordConfirm'
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
                           name='adminKey'
                           autoComplete='new-admin-key'
                           style={styles.input.left}
                           className={classes.input}
                           placeholder='Admin Key'
                           onChange={(e) => setAdminKey(e.target.value)}
                        />
                        <Input
                           type='password'
                           name='adminKeyConfirm'
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
                           name='email'
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
                  className={classes.button}
                  style={styles.button}
                  color='login-light'
                  block
                  size='lg'
                  outline>
                  {mode}
               </Button>
            </CardBody>
         </Form>
      </Card>
   );
};

const classes = {
   card: "bg-login-form text-center my-4 mx-auto shadow",
   labelTitle: "bg-login-form text-login-light",
   alert: "mb-4",
   cardBody: "bg-login-form p-0",
   formGroup: "bg-login-form mb-4",
   input: "text-login-form",
};

const styles = {
   card: {
      borderRadius: "12px",
      padding: "24px",
      width: "440px",
   },
   cardBody: {
      borderRadius: "12px",
   },
   labelTitle: {
      fontWeight: "300",
      fontSize: "30px",
      marginBottom: "20px",
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
};

User.propTypes = {
   location: PropTypes.object, // URL details
   mode: PropTypes.string, //Type of user page
};

export default User;
