/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import axios from 'axios';
import withStyles from "@material-ui/core/styles/withStyles";

import Table from 'react-material/components/Table/Table';
import Button from 'react-material/components/CustomButtons/Button';
import GridContainer from 'react-material/components/Grid/GridContainer';
import GridItem from 'react-material/components/Grid/GridItem';
import Card from "react-material/components/Card/Card.jsx";
import CardHeader from "react-material/components/Card/CardHeader.jsx";
import CardBody from "react-material/components/Card/CardBody.jsx";
import Spinner from 'react-spinner-material';

import CustomDataGrid from './datagrid';
import config from 'config.json';

const isEmptyObj = object => !Object.getOwnPropertySymbols(object).length && !Object.getOwnPropertyNames(object).length;

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    fontSize: "1.5em",
    "& small": {
      color: "#777",
      fontSize: "100%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardDataGrid: {
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: "1.5em"
  },
  showSpinner: {
    margin: "auto 0px"
  }
};

class Connected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quickBooks: [],
      visible: false,
      info: null,
      datalist: null
    };

    this.initialize = this.initialize.bind(this);
    this.lanchPopup = this.lanchPopup.bind(this);
    this.apicall = this.apicall.bind(this);
    this.refreshCall = this.refreshCall.bind(this);
    this.revokeCall = this.revokeCall.bind(this);
    this.getConnects = this.getConnects.bind(this);
  }

  initialize() {
    this.setState(currentState => {
      return {
        ...currentState,
        visible: true,
        info: null,
        datalist: null
      }
    });
  }

  lanchPopup(path) {
    var parameters = "location=1,width=800,height=650";
    parameters += ",left=" + (window.screen.width - 800) / 2 + ",top=" + (window.screen.height - 650) / 2;

    // Launch Popup
    window.open(`${config.API_URL}${path}`, 'connectPopup', parameters);
  }

  apicall(realmID) {
    this.initialize();

    axios
    .get(`${config.API_URL}/dmtest/api_call?realmID=${realmID}`, {})
    .then((res) => {
      let repo = res.data;

      let info = `Report Name - ${repo['Header']['ReportName']}\nFor Date: ${repo['Header']['DateMacro']} (${repo['Header']['StartPeriod']} - ${repo['Header']['EndPeriod']})\nCurrency: ${repo['Header']['Currency']}`;

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
          visible: false,
          info: info,
          datalist: {
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
    this.initialize();

    axios
    .get(`${config.API_URL}/api_call/refresh?realmID=${realmID}`, {})
    .then((res) => {
      let info = JSON.stringify(res.data, null, 2);
      this.setState(currentState => {
        return {
          ...currentState,
          visible: false,
          info: info,
          datalist: null
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  revokeCall(realmID) {
    this.initialize();

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
          visible: false,
          info: null,
          datalist: null
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
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={4} md={8}>
            <Card>
              <CardHeader color="primary">
                <div className={classes.cardTitleWhite}>
                  <a className="img-holder imgLink" href="#" onClick={() => {this.lanchPopup('/sign_in_with_intuit')}} >
                    <img style={{height: "40px"}} src="/images/IntuitSignIn-lg-white@2x.jpg" alt="..."/>
                  </a>
                  <a className="img-holder imgLink" href="#" onClick={() => {this.lanchPopup('/connect_to_quickbooks')}}>
                    <img style={{height: "40px"}} src="/images/C2QB_white_btn_lg_default.png" alt="..."/>
                  </a>
                </div>
                <p className={classes.cardCategoryWhite}>
                  Would you like to make an API call?
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["#", "RealmID", "QuickBooks API Call", "Refresh Token Call", "Revoke Token Call"]}
                  tableData={this.state.quickBooks}
                />
              </CardBody>
            </Card>
          </GridItem>
          {this.state.visible ? 
          <GridItem xs={12} sm={12} md={12}>
            <div className={"load-spinner"}>
              <Spinner size={80} spinnerColor={"#333"} spinnerWidth={2} className={classes.showSpinner}/>
            </div>
          </GridItem>
          :
          this.state.info ?
          <GridItem xs={12} sm={6} md={6}>
            <Card plain>
              <CardHeader plain color="warning" xs={3} sm={3} md={4}>
                <p className={"line-break"}>
                  {this.state.info}
                </p>
              </CardHeader>
            </Card>
          </GridItem>
          :
            null
          }
          {this.state.datalist ?
          <GridItem xs={12} sm={12} md={12}>
            <CustomDataGrid datainfo={this.state.datalist}/>
          </GridItem>
          :
          null
          }
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles)(Connected);