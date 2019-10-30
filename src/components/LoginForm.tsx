import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { FormControl, Input, TextField } from '@material-ui/core';


export class LoginForm extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    render() {
        return (
            <div className="loginForm">
                <TextField label="email" type="email" placeholder="example@lecshure.com"/>
                <TextField label="password" type="password" placeholder="password"/>
            </div>
        );
    }
}