import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import SortIcon from "@material-ui/icons/ArrowDownward";
//import movies from "./movies";
//import reportWebVitals from './reportWebVitals';
import { useState, useEffect } from 'react';



function App() {
  const [tabledata, setTabledata] = useState([]);
  const [tables, setTables] = useState([]);
  const [table, setTable] =useState('foodgroup');
  const [columns, setColumns]=useState([]);
  const [but1, setBut1]=useState(true);
  const [conditionvalue,setConValue]=useState('');
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
            name: json[i].Field,
            selector:json[i].Field,
            sortable: true,
          }
          col.push(ob)
        }
        setColumns(col)
        console.log("cccc")
      });
      console.log(conditionvalue);
      fetch(`/tabledata/?table=${table}&condition=${conditionvalue}`)
      .then((res) => res.json())
      .then((json) => {
        setTabledata(json);
      });
    },[table,but1]);

  const tablechange = (event) => {
    setTable(event.target.value);
  };
  const conditionchange = (event) => {
    setConValue(event.target.value);
  }
  function searchbutton() {
    if(but1){
      setBut1(false);
    } else {
      setBut1(true);
    }
  console.log("search");
  }
  return (
    <div className="App">
      
      <form>
        <label>
          <input type="text" onChange={conditionchange} />
        </label>
      </form>   
      <button onClick={searchbutton}>
        search
      </button>
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

      <Card>
        <DataTable
          title={table}
          columns={columns}
          data={tabledata}
          defaultSortFieldId={1}
          pagination
        />
      </Card>
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
