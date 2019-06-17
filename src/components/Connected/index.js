/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import axios from 'axios';

import Table from 'react-material/components/Table/Table';
import Button from 'react-material/components/CustomButtons/Button';
import ConnectList from './connectlist';
import config from 'config.json';

const isEmptyObj = object => !Object.getOwnPropertySymbols(object).length && !Object.getOwnPropertyNames(object).length;

export default class Connected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quickBooks: [],
      message: null,
      datainfo: null
    };

    this.lanchPopup = this.lanchPopup.bind(this);
    this.apicall = this.apicall.bind(this);
    this.refreshCall = this.refreshCall.bind(this);
    this.revokeCall = this.revokeCall.bind(this);
    this.getConnects = this.getConnects.bind(this);
  }

  lanchPopup(path) {
    var parameters = "location=1,width=800,height=650";
    parameters += ",left=" + (window.screen.width - 800) / 2 + ",top=" + (window.screen.height - 650) / 2;

    // Launch Popup
    window.open(`${config.API_URL}${path}`, 'connectPopup', parameters);
  }

  apicall(realmID) {
    this.setState(currentState => {
      return {
        ...currentState,
        message: "Loading...",
        datainfo: null
      }
    });

    axios
    .get(`${config.API_URL}/dmtest/api_call?realmID=${realmID}`, {})
    .then((res) => {
      let repo = res.data;

      let info = `Report Name - ${repo['Header']['ReportName']}\nFor Date: ${repo['Header']['DateMacro']} (${repo['Header']['StartPeriod']} - ${repo['Header']['EndPeriod']})\nCurrency: ${repo['Header']['Currency']}\n`;

      let rows=[], columns=[], creditKey;
      repo['Columns']['Column'].forEach((column, headerKey) => {
        columns.push({key: column['ColTitle'], name: column['ColTitle'], resizable: true, draggable: true});
        if(column['ColTitle'] === 'Credit') {
          creditKey = headerKey;
        }
      });

      repo['Rows']['Row'].forEach(row => {
        let mainRow = row['Rows']['Row'];
        mainRow.forEach(detailRow => {
          const detailRowColData = detailRow['ColData'];
          let gridrow = {};
          detailRowColData.forEach((cellDetail, detailKey) => {
            if(detailRowColData[0]['value'] !== "Beginning Balance") {
              let cellContents = cellDetail['value'];
              if(detailKey === creditKey) {
                cellContents = Math.abs(cellDetail['value']) * -1;
              }
              gridrow[columns[detailKey].key] = cellContents;
            }
          });
          if(!isEmptyObj(gridrow)) {
            rows.push(gridrow);
          }
        });
      });

      this.setState(currentState => {
        return {
          ...currentState,
          message: info,
          datainfo: {
            rows: rows,
            columns: columns
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  refreshCall(realmID) {
    this.setState(currentState => {
      return {
        ...currentState,
        message: "Loading...",
        datainfo: null
      }
    });

    axios
    .get(`${config.API_URL}/api_call/refresh?realmID=${realmID}`, {})
    .then((res) => {
      let info = JSON.stringify(res.data, null, 2);
      this.setState(currentState => {
        return {
          ...currentState,
          message: info,
          datainfo: null
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  revokeCall(realmID) {
    axios
    .get(`${config.API_URL}/api_call/revoke?realmID=${realmID}`, {})
    .then((res) => {
      this.getConnects();
    })
    .catch((err) => {
      console.log(err.response.data);
    });
  }

  getConnects() {
    let self =this;
    axios
    .get(`${config.API_URL}/dmtest`, {})
    .then((res) => {
      let data = [];
      for(let i = 0; i < res.data.length; i++) {
        let row = [];
        row.push(i);
        row.push(res.data[i].realmID);
        row.push(<Button color="info" onClick={() => {self.apicall(res.data[i].realmID)}}>QuickBooks API Call</Button>);
        row.push(<Button color="success" onClick={() => {self.refreshCall(res.data[i].realmID)}}>Refresh Token Call</Button>);
        row.push(<Button color="danger" onClick={() => {self.revokeCall(res.data[i].realmID)}}>{res.data[i].token? "Revoke Token call" : "Delete"}</Button>);
        
        data.push(row);
      }
      self.setState({
          quickBooks: data,
          message: null,
          datainfo: null
      });
      console.log("Get QuickBooks Success");
    })
    .catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.getConnects();
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
        <div id="result">
          {this.state.message ? this.state.message: ""}
        </div>
        <hr/>
        <div id="datagrid">
          {this.state.datainfo ? <ConnectList datainfo={this.state.datainfo}/> : null}
        </div>
      </div>
    )
  }
}