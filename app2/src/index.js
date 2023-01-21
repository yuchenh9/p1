import React, { useInsertionEffect } from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import shortid from "shortid";
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
  const [but2, setBut2]=useState(true);
  const [conditionvalue,setConValue]=useState('');
  const [conditionQuery,setConditionQuery]=useState('');

 const [conditionList,setConditionList]=useState([]);
  const [cellClick, setCellClick]=useState({cell:{},feildName:""});
  const [page,setPage]=useState(0)
//fetchtable when 1.need a new table 2. move page of the same table 3. search
  function fetchTable(inputtable,inputconition,inputpage){
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
    fetch(`/tabledata/?table=${inputtable}&condition=${inputconition} LIMIT 30 OFFSET ${inputpage*50}`)
    .then((res) => res.json())
    .then((json) => {
      setTabledata(json);
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
    setPage(0);
    fetchTable(table,conditionQuery,page)
    },[but1]);  



  useEffect(() => {
    if(conditionvalue==''){
      return;
    }
    
    setConditionList((conditionList)=>[...conditionList,{value:conditionvalue,id:shortid.generate()}])
    setConValue('');
      
    },[but2]);



    useEffect(()=>{
      var queryString='';
      if(table=='foodname'&&(conditionList.length !== 0)){
        queryString='WHERE ';
        var first=true;
        for(const i of conditionList){
          if(first){
            queryString=queryString+`FoodDescription LIKE '%${i.value}%'`;
            first=false;
            continue;
          }
          queryString=queryString+` AND FoodDescription LIKE '%${i.value}%'`;
         
        }
        setConditionQuery(queryString);
      
    }
    console.log(queryString)
      fetchTable(table,queryString,0)
    },[conditionList])



  useEffect(()=>{
    console.log("table :")
    console.log(table)
    if(page==0){//solved bug
      fetchTable(table,conditionQuery,page);//
    }else {setPage(0);}//
  },[table])
  //change table means change page tabledata

  useEffect(()=>{
    if(table=="foodname" && (cellClick.feildName=="FoodDescription"||cellClick.feildName=="FoodID")) {
      console.log("clicked");
        setConValue(`WHERE FoodID = ${cellClick.cell["FoodID"]}`)//pattern of setcon and then table ; i want conditionvalue goes to the new table,what if i do not want to(when i change the table with the select box)
        setTable("nutrientamount")
    }
    if(table=="foodgroup" && (cellClick.feildName=="FoodGroupName"||cellClick.feildName=="FoodGroupID")) {
        console.log("clicked");
        setConValue(`WHERE FoodGroupID = ${cellClick.cell["FoodGroupID"]}`)
        setTable("foodname")
    }
    
  },[cellClick])
//cellClick means change table and querycondition


useEffect(()=>{
  if(conditionvalue.includes("WHERE")){
    console.log("WHERE!!!!!!!!!!!!!!!!!")
  }
},[conditionvalue])

  useEffect(()=> {
    console.log("page :")
    console.log(page)
    fetchTable(table,conditionQuery,page);
  },[page])



  const tablechange = (event) => {
    setConValue("");
    setTable(event.target.value);
  };



  const conditionQuerychange = (event) => {
    setConditionQuery(event.target.value);
  }


  const conditionvalueChange=(event)=>{
    setConValue(event.target.value)
  }

  const onCellClicked = (input) => {
    setCellClick(input);
  }



  function onPrevPage(){
    if (page==0){
      return
    }
    setPage((page)=>page-1)
    
    console.log("prev")
    console.log(page)
  }
  

  
  function onNextPage(){
    setPage((page) => page+1)
    console.log("next")
    console.log(page)
  }
  //🥩
  //🥕
  //🍒
  //items: prev.items.filter(prevItem => prevItem.id !== item.id)
//setFruits((current) =>
//current.filter((fruit) => fruit.id !== 2)
//);
const onRemove=(id)=>{
  setConditionList((current)=>current.filter((i)=>
    i.id!==id))
}




//🥩 CUT OF MEAT
//129385
//U+1F969
//🥕 708	U+1F955 🍅702	U+1F345🍆706	U+1F346	🥬713	U+1F96C
//🍉688	U+1F349🥝701	U+1F95D 🍒698	U+1F352
//🥔707	U+1F954🌽709	U+1F33D
//(ginger root)720	U+1FADA	🧄715	U+1F9C4
//🥜🌰717	U+1F95C 719	U+1F330
//🍞722	U+1F35E
//🧀730	U+1F9C0
//🍔735	U+1F354
//🍱756	U+1F371
//🍣765	U+1F363
//🍼792	U+1F37C (baby)
//🥡772	U+1F961	
//🧂754	U+1F9C2
//🍳746	U+1F373
//🥘747	U+1F958
//⏳960	U+23F3 ⌛959	U+231B
/*
<div style={{display:"flex"}}>
      <form>
          <label>
            <input type="text" style={{justifyContent: "left",float:"left"}} value ={conditionvalue2} onChange={conditionchange2} />
          </label>
        </form>  
        <div style={{justifyContent: "left",float:"left",border:"solid"}} onClick={()=>setBut2(!but2)}>
          add
        </div>
      </div>
      */
  return (
    <div className="App">
      
      <div style={{display:"flex"}}>
      <form>
          <label>
            <input type="text" style={{justifyContent: "left",float:"left"}} value ={conditionvalue} onChange={conditionvalueChange} />
          </label>
        </form>  
        <div style={{justifyContent: "left",float:"left",border:"solid"}} onClick={()=>setBut2(!but2)}>
          add
        </div>
          {conditionList.map((i)=>(
          <div style={{display:"flex",justifyContent: "center",float:"left",border:"solid",borderRadius:10}}>
            {i.value}<div id={i.id} onClick={()=>onRemove(i.id)}> X</div>
          </div>
          ))}
      </div>
      <div style={{display:"flex"}}>
        <form>
          <label>
            <input type="text" style={{justifyContent: "left",float:"left"}} value ={conditionQuery} onChange={conditionQuerychange} />
          </label>
        </form>   
          <div style={{justifyContent: "left",float:"left",border:"solid"}} onClick={()=>setBut1(!but1)}>
          search
        </div>

      </div>
      <div>
      <div style={{display:"flex"}}>
        <label>
          tables
          <select value={table} onChange={tablechange}>
            {tables.map((option) => (
              <option value={option.Tables_in_foods}>{option.Tables_in_foods}</option>
            ))}
          </select>
        </label>
      </div>
      </div>
      <div>
      <FeildCells feilds={columns}/>
      </div>
      <div>
      <DataCell feilds={columns} data={tabledata} onMyCellClicked={onCellClicked}/>
      </div>
      <div style={{display: 'flex',justifyContent: "center"}}>
        <div onClick={() => onPrevPage()} style={{float:"left",fontSize:"5em"}}>&nbsp;&nbsp;&nbsp;&nbsp;&#60;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div style={{float:"left",fontSize:"5em"}}>{page}</div>
        <div onClick={() => onNextPage()} style={{float:"left",fontSize:"5em"}}>&nbsp;&nbsp;&nbsp;&nbsp;&#62;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
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
