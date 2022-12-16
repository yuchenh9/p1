import React from 'react';
//import movies from "./movies";
//import reportWebVitals from './reportWebVitals';
import { useState, useEffect } from 'react';
function Tables() {
    const [tables, setTables] = useState([]);
    const [value, setValue] =useState('foodgroup');
    useEffect(() => {
      fetch("/tables")
      .then((res) => res.json())
      .then((json) => {
        setTables(json);
      });});

      const handleChange = (event) => {
        setValue(event.target.value);
      };
    return (
      <div>
        <label>
          tables
          <select value={value} onChange={handleChange}>
            {tables.map((option) => (
              <option value={option.Tables_in_foods}>{option.Tables_in_foods}</option>
            ))}
          </select>
        </label>
  
      </div>
    );
  };
  export default Tables