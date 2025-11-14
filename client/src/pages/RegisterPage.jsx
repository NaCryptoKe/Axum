import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

import NavbarComponent from "../Components/NavbarComponent.jsx";
import InputFieldComponent from "../Components/InputFieldComponent.jsx";

import '../css/page.css'

const RegisterPage = () =>{
    return(
        <>
            <NavbarComponent/>

            <div className="signup-wrapper">
                <form action="" className="form-body">
                    <div className="input-field">
                        <InputFieldComponent
                            type="text"
                            placeholder="First Name"
                            required={true}/>
                        <InputFieldComponent
                            type="text"
                            placeholder="Last Name"
                            required={true}/>
                        <InputFieldComponent
                            type="text"
                            placeholder="Username"
                            required={true}/>
                        <InputFieldComponent
                            type="text"
                            placeholder="Email"
                            required={true}/>
                        <InputFieldComponent
                            type="text"
                            placeholder="Password"
                            required={true}/>
                        <InputFieldComponent
                            type="text"
                            placeholder="Confirm Password"
                            required={true}/>
                    </div>

                    <div className="check-box">
                        <div className="terms">
                            <InputFieldComponent
                                type="checkbox"
                                required={true}/>
                            <label htmlFor="">I have read the terms and conditions and accept them</label>
                        </div>
                        <div className="optional">
                            <InputFieldComponent type="checkbox"/>
                            <label htmlFor="">Send me updates via email (Optional)</label>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default RegisterPage;