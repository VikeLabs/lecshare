import React from 'react';
import { TextField, Button } from '@material-ui/core';


interface IState {
    email: string,
    password: string,
};

interface IProps {};

export default class LoginForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // encode the data
        const data = new FormData();
        data.set('email', this.state.email);;
        data.set('password', this.state.password);

        fetch('/api/login', 
        )
    }

    render() {
        return (
            <form className="loginForm" onSubmit={this.handleSubmit}>
                <TextField label="email" type="email" placeholder="example@lecshure.com"/><br/>
                <TextField label="password" type="password" placeholder="password"/>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}
