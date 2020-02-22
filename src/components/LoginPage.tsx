import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../component-css/loginpagecss.css';
import { useState } from 'react';

interface LoginProps {
    verifyLogin: (username: string, password: string) => boolean;
    authenticated: boolean;
}


function LoginPage(props: LoginProps) {

    const [verifying, setVerifying] = useState(true);
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [attempted, setAttempted] = useState(false);
    const [authenticated ,setAuthenticated] = useState(false);
    
    const useStyles = makeStyles(theme => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                alignContent: 'center'
            },        
        },
    }));
    const classes = useStyles();

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const handlePasswordChange =(e: React.ChangeEvent<HTMLInputElement>) =>  {
        setPassword(e.target.value);
    }

    const handleLogIn = () =>  {
        let success = props.verifyLogin(userName, password);
        if(success) {
            console.log("valid credentials!");
            setAuthenticated(true);
        } else {
            console.log("invalid credentials!");
            setAttempted(true);
        }
        
    }

    let alert;

    if(attempted === true) {
        alert = <div className="failAttempt">Invalid credentials! Please try again.</div>
    } else {
        alert = <div/>
    }

    return (
        <div>
            {props.authenticated ? (
                <div/>
            ) : (
            <div className="loginContainer">
                Lecshare Login
                <div className="formContainer">
                    <form className={classes.root} noValidate autoComplete="off">
                        <div>
                            <TextField 
                                id="standard-required" 
                                label="Username" 
                                onChange= {handleUsernameChange}
                            />
                        </div>
                        <div>
                            <TextField
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                onChange = {handlePasswordChange}
                            />
                        </div>
                        <Button color="primary" onClick={handleLogIn}>
                            Log In
                        </Button>
                    </form>
                    {alert}
                </div>
            </div>
            )}
        </div>
    
    );
}

export default LoginPage;