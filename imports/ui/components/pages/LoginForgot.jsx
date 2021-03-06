'use strict';

import React from "react";

import { connect } from 'react-redux';
import LoginForgotFormStepOne from './login_forgot_components/LoginForgotFormStepOne.jsx'
import {Link} from 'react-router'

class LoginForgot extends React.Component{
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div style={{padding: "20px"}}>
        <div style={{minWidth: "284px", textAlign: "center",display: "flex", alignItems: "center",justifyContent: "center",flexDirection: "column"}}>
        <br/><br/>
          <h2>找回密码</h2><br/>
          <div style={
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width:"30%"
            }
          }>
          <div><h3>步骤1，确认您的用户名</h3></div>
          <div><br/></div>
          <div><Link to="/login">返回</Link></div>
          </div>
          <LoginForgotFormStepOne />
        </div>

      </div>
    )
  }
}
function mapStateToProps(state) {
  return {

   };
}

export default connect(mapStateToProps)(LoginForgot);
