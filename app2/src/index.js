import React, { useInsertionEffect } from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import SortIcon from "@material-ui/icons/ArrowDownward";
//import movies from "./movies";
//import reportWebVitals from './reportWebVitals';
import { useState, useEffect } from 'react';

import { Grid } from '@mui/material';
import { FeildCells } from './datarow';
import { DataCell } from './datarow';
function App() {
  const [tabledata, setTabledata] = useState([]);
  const [tables, setTables] = useState([]);
  const [table, setTable] =useState('foodgroup');
  const [columns, setColumns]=useState([]);
  const [but1, setBut1]=useState(true);
  const [conditionvalue,setConValue]=useState('');
  const [cellClick, setCellClick]=useState({cell:{},feildName:""});
  const [page,setPage]=useState(0)

  function fetchTable(inputtable,inputconition){
    console.log("fetchtable")
    fetch(`/showtablecolumns/?table=${inputtable}`)
    .then((res) => res.json())
    .then((json) => {
      var col =[]
      for(var i = 0; i < json.length; i++){
        var ob = 
        {
          Feild: json[i].Field
        }
        col.push(ob)
      }
      setColumns(col)
    });
    fetch(`/tabledata/?table=${inputtable}&condition=${inputconition}`)
    .then((res) => res.json())
    .then((json) => {
      setTabledata(json);
      setConValue("")
    });
  }

  useEffect(()=>{
    
    fetch("/showtables")
    .then((res) => res.json())
    .then((json) => {
      setTables(json);
      });    
    console.log("init")
  },[1])



  useEffect(() => {
    console.log(table)
      fetch(`/showtablecolumns/?table=${table}`)
      .then((res) => res.json())
      .then((json) => {
        var col =[]
        for(var i = 0; i < json.length; i++){
          var ob = 
          {
            Feild: json[i].Field
          }
          col.push(ob)
        }
        setColumns(col)
      });
      console.log(conditionvalue);
      if(table=="foodname"&&conditionvalue!=""){
        fetch(`/tabledata/?table=${table}&condition=WHERE FoodDescription LIKE '%${conditionvalue}%'`)
      .then((res) => res.json())
      .then((json) => {
        setTabledata(json);
      });
      }
        
      
    },[but1]);



  useEffect(()=>{
    fetchTable(table,conditionvalue);
  },[table])
  //change table means change page tabledata

  useEffect(()=>{
    if(table=="foodname" && (cellClick.feildName=="FoodDescription"||cellClick.feildName=="FoodID")) {
        setConValue(`WHERE FoodID = ${cellClick.cell["FoodID"]}`)
        setTable("nutrientamount")
    }
    if(table=="foodgroup" && (cellClick.feildName=="FoodGroupName"||cellClick.feildName=="FoodGroupID")) {
        setConValue(`WHERE FoodGroupID = ${cellClick.cell["FoodGroupID"]}`)
        setTable("foodname")
    }
    
  },[cellClick])
//cellClick means change table and querycondition


  useEffect(()=> {
    console.log('columns')
  console.log(columns)
  },[columns])

  useEffect(()=>{
  },[page])

  const tablechange = (event) => {
    setTable(event.target.value);
  };



  const conditionchange = (event) => {
    setConValue(event.target.value);
  }



  const searchbutton = (str) => () => {

    console.log(str);
    setBut1(!but1);

  };



  const onCellClicked = (input) => {
    setCellClick(input);
  }


  


  return (
    <div className="App">
      
      <form>
        <label>
          <input type="text" onChange={conditionchange} />
        </label>
      </form>   
      <div style={{border:"solid"}} onClick={searchbutton("s")}>
        search
      </div>
      <div>
        <label>
          tables
          <select value={table} onChange={tablechange}>
            {tables.map((option) => (
              <option value={option.Tables_in_foods}>{option.Tables_in_foods}</option>
            ))}
          </select>
        </label>
  
      </div>
      <div>
      <FeildCells feilds={columns}/>
      </div>
      <div>
      <DataCell feilds={columns} data={tabledata} onMyCellClicked={onCellClicked}/>
      </div>
      <div onClick={() => setPage(page-1)} style={{float:"left",fontSize:"5em"}}>&nbsp;&nbsp;&nbsp;&nbsp;&#60;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div style={{float:"left",fontSize:"5em"}}>{page}</div>
      <div onClick={() => setPage(page+1)} style={{float:"left",fontSize:"5em"}}>&nbsp;&nbsp;&nbsp;&nbsp;&#62;&nbsp;&nbsp;&nbsp;&nbsp;</div>
    </div>
  );
};

const rootElement = ReactDOM.createRoot(document.getElementById("root"));
rootElement.render(<App />);

/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
