import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
//import DataTable from "react-data-table-component";
//import Card from "@material-ui/core/Card";
//import SortIcon from "@material-ui/icons/ArrowDownward";
//import movies from "./movies";
//import reportWebVitals from './reportWebVitals';
import { useState, useEffect } from 'react';

import { Grid } from '@mui/material';
export function FeildCells(props) {
  const feilds = props.feilds;
  const feildCells = feilds.map((feildObj) =>
  <Grid item xs={2}>{feildObj["Feild"]}</Grid>
  );
  return (
   <Grid container mt={1} style={{border:"solid"}} spacing={1}>{feildCells}</Grid>
  );
}

export function DataCell(props){
const data=props.data;
const feilds=props.feilds;
const onMyCellClicked=props.onMyCellClicked;
const cells= data.map((i) =>
  <Grid   container
  item 
  direction="row"
  justifyContent="flex-start"
  alignItems="flex-start" style={{border:"solid"}} >
    {feilds.map((feildObj)=>
      <Grid item  xs={2}>
        <div onClick={() => onMyCellClicked({cell:i,feildName:feildObj["Feild"]})}>{i[feildObj["Feild"]]} </div>
      </Grid>)}
   </Grid>
)



  return(
    <Grid  container
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    style={{border:"solid"}} 
    mt={1}
    spacing={4}>
      {cells}
      </Grid>
  )
}
  