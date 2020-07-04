import React, { useState } from "react";
import { useStoreActions } from "easy-peasy";
import {
   Card,
   Label,
   CardBody,
   Form,
   FormGroup,
   Button,
   Input,
} from "reactstrap";
import PropTypes from "prop-types";

const Login = () => {
   // Set state variable
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

   // Bring in commands
   const login = useStoreActions((actions) => actions.login);

   // Define methods
   const onSubmit = async (e) => {
      e.preventDefault();
      const auth = await login({ username, password });

      // Check for token
      if (auth.token) {
         /// SET AUTHORIZATION TOKEN IN SESSION STORAGE
         sessionStorage.setItem("token", auth.token);
      } else {
         // Handle failed token
         console.log("Failed to get token in component");
      }
   };

   return (
      <Card className={classes.card} style={styles.card}>
         <Label
            className={classes.labelTitle}
            style={styles.labelTitle}
            for='formUsername'>
            TEAM 7558 SCOUTING APP
         </Label>
         <Form className={classes.form} onSubmit={onSubmit}>
            <CardBody className={classes.cardBody} style={styles.cardBody}>
               <FormGroup className={classes.formGroup}>
                  <Input
                     type='text'
                     name='username'
                     id='formUsername'
                     style={styles.input}
                     className={classes.input}
                     placeholder='Username'
                     onChange={(e) => setUsername(e.target.value)}
                  />
               </FormGroup>
               <FormGroup className={classes.formGroup}>
                  <Input
                     type='password'
                     name='password'
                     id='formPassword'
                     style={styles.input}
                     className={classes.input}
                     placeholder='Password'
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </FormGroup>
               <Button
                  className={classes.button}
                  style={styles.button}
                  color='login-light'
                  block
                  size='lg'
                  outline>
                  Login
               </Button>
            </CardBody>
         </Form>
      </Card>
   );
};

const classes = {
   card: "bg-login-form text-center my-4 mx-auto shadow",
   labelTitle: "bg-login-form text-login-light",
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
      fontWeight: "400",
   },
   button: {
      marginTop: "32px",
      fontWeight: "400",
   },
};

Login.propTypes = {
   location: PropTypes.object, // URL Details
};

export default Login;
