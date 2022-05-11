import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';

const Form = styled.div`
    width: 220px;
`;

const Field = styled.div`
    margin-top: 12px;
`;

const Label = styled.label`
    display: block;
`;

const Input = styled.input`
    width: 100%;
    box-sizing: border-box;
    line-height: 28px;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
`;

const Button = styled.button`
    margin-top: 8px;
    width: 100%;
`;

export default class SignUp extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            username: '',
            password: '',
        };
    }

    onChangeEmail = (event) => {
        const { value } = event.target;
        this.setState(() => {
            return {
                email: value,
            };
        });
    };

    onChangeUsername = (event) => {
        const { value } = event.target;
        this.setState(() => {
            return {
                username: value,
            };
        });
    };

    onChangePassword = (event) => {
        const { value } = event.target;
        this.setState(() => {
            return {
                password: value,
            };
        });
    };

    onClickSignUp = () => {
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
            },
            url: '/api/auth/signup',
        };
        return axios(options)
            .then(() => {
                window.location.href = 'signin.html';
            })
            .catch(() => {
                alert('Error Sign Up');
            });
    };

    render() {
        return (
            <Form>
                <Field>
                    <Label>Email</Label>
                    <Input
                        type="text"
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                    />
                </Field>

                <Field>
                    <Label>Username</Label>
                    <Input
                        type="text"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                    />
                </Field>

                <Field>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                    />
                </Field>

                <Button onClick={this.onClickSignUp}>Sign Up</Button>
            </Form>
        );
    }
}
