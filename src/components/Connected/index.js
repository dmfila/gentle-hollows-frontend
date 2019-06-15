/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import axios from 'axios';

import Table from 'react-material/components/Table/Table';
import Button from 'react-material/components/CustomButtons/Button';
import ConnectList from './connectlist';

export default class Connected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quickBooks: [],
      curentConnect: null
    };

    this.lanchPopup = this.lanchPopup.bind(this);
    this.apicall = this.apicall.bind(this);
    this.refreshCall = this.refreshCall.bind(this);
    this.revokeCall = this.revokeCall.bind(this);
  }

  lanchPopup(path) {
    let parameters = "location=1, width=800, height=650";
    parameters += ",left=" + (window.screen.width - 800) / 2 + ",top=" + (window.screen.height - 650) / 2;

    // Launch Popup
    path = "localhost:4000" + path;
    console.log(path);
    window.open(path, 'connectPopup', parameters);
  }

  apicall(realmID) {
    this.setState(currentState => {
      return {
        ...currentState,
        curentConnect: realmID
      }
    });
  }

  refreshCall(realmID) {
    axios
    .get(`/api_call/refresh/${realmID}`, {})
    .then((res) => {
      let div = document.getElementById('result');
      div.innerHTML = JSON.stringify(res.data, null, 2);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
  }

  revokeCall(realmID) {
    axios
    .get(`/api_call/revoke/${realmID}`, {})
    .then((res) => {
      let div = document.getElementById('result');
      div.innerHTML = JSON.stringify(res.data, null, 2);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
  }

  componentDidMount() {
    axios
    .get(`/connected`, {})
    .then((res) => {
      let data = [];
      for(let i = 0; i < res.data.length; i++) {
        let row = [];
        row.push(i);
        row.push(res.data[i].realmID);
        row.push(<Button color="info" onClick={() => {this.apicall(res.data[i].realmID)}}>QuickBooks API Call</Button>);
        row.push(<Button color="success" onClick={() => {this.refreshCall(res.data[i].realmID)}}>Refresh Token Call</Button>);
        row.push(<Button color="danger" onClick={() => {this.revokeCall(res.data[i].realmID)}}>{res.data[i].token? "Revoke Token call" : "Delete"}</Button>);
        
        data.push(row);
      }
      this.setState(currentState => {
        return {
          ...currentState,
          quickBooks: data
        }
      });
      console.log("Get QuickBooks Success");
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div className="container">
        <br /><br /><br />
        <div className="jumbotron border border-primary">
          <p style={{color: "red"}}>Welcome!</p>
          <p style={{color: "red"}}>Would you like to make an API call?</p>

          <div className="jumbotron border border-primary">
            {/* <ul className="dropdown-menu"> */}
              {/* <li className=""> */}
                <a className="img-holder imgLink" href="#" onClick={() => {this.lanchPopup('/sign_in_with_intuit')}} >
                    <img style={{height: "40px"}} src="/images/IntuitSignIn-lg-white@2x.jpg" alt="..."/>
                </a>
                <a className="img-holder imgLink" href="#" onClick={() => {this.lanchPopup('/connect_to_quickbooks')}}>
                    <img style={{height: "40px"}} src="/images/C2QB_white_btn_lg_default.png" alt="..."/>
                </a>
              {/* </li> */}
            {/* </ul> */}
          </div>

          <Table
            tableHeaderColor="warning"
            tableHead={["#", "RealmID", "QuickBooks API Call", "Refresh Token Call", "Revoke Token Call"]}
            tableData={this.state.quickBooks}
          />
        </div>
        <div id="result"/>
        {this.state.curentConnect ? <ConnectList realmID={this.state.curentConnect}/> : null}
      </div>
    )
  }
}