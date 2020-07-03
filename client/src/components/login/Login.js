import React from "react";
import {
   Card,
   Label,
   CardBody,
   CardImg,
   Form,
   FormGroup,
   Button,
   Input,
} from "reactstrap";
import QueryString from "query-string";
import PropTypes from "prop-types";

const Login = ({ location: { search } }) => {
   const query = QueryString.parse(search);
   return (
      <Card className={classes.card} style={styles.card}>
         <Label
            className={classes.labelTitle}
            style={styles.labelTitle}
            for='formUsername'>
            TEAM 7558 SCOUTING APP
         </Label>
         <img src='../../assets/photos/infiniterechargelogo.png' />
         <Form className={classes.form}>
            <CardBody className={classes.cardBody} style={styles.cardBody}>
               <FormGroup className={classes.formGroup}>
                  <Input
                     type='text'
                     name='username'
                     id='formUsername'
                     className={classes.input}
                     placeholder='Username'
                  />
               </FormGroup>
               <FormGroup className={classes.formGroup}>
                  <Input
                     type='password'
                     name='password'
                     id='formPassword'
                     className={classes.input}
                     placeholder='Password'
                  />
               </FormGroup>
               <Button
                  className={classes.button}
                  style={styles.button}
                  color='login-light'
                  block
                  size='lg'
                  outline
                  onClick={() => console.log()}>
                  Login
               </Button>
            </CardBody>
         </Form>
      </Card>
   );
};

const classes = {
   card: "bg-login-form text-center my-4 mx-auto ",
   labelTitle: "bg-login-form text-login-light",
   cardBody: "bg-login-form p-0",
   formGroup: "bg-login-form",
   input: "text-login-form",
   label: "mb-0",
};

const styles = {
   card: {
      borderRadius: "12px",
      padding: "24px",
      width: "480px",
   },
   cardBody: {
      borderRadius: "12px",
   },
   labelTitle: {
      fontWeight: "400",
      fontSize: "32px",
      marginBottom: "32px",
   },
   button: {
      marginTop: "32px",
   },
};

Login.propTypes = {
   location: PropTypes.object, // URL Details
};

export default Login;
