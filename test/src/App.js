//import carrot from './carrot_striped.png';
//import tomato from './tomato_striped.png';
import './App.css';
import React, { useState } from 'react';
//const carrot='./carrot_striped.png';
//const tomato ='./tomato_striped.png';
function RoundedCornerBox(props) {
  let ratio=props.ratio;
  const boxStyle = {
    borderRadius: '250px',
    background: '#A9A9A9',
    padding: '0px',
    width: '40px',
    height: '5px',
    order: '1'
  };
  if(ratio<0.12){
    //ratio=0.12
  }
  const boxStyle2 = {
    borderRadius: '2500px',
    background: props.color,
    padding: '0px',
    width: `${ratio*100}%`,
   //width: '12%',
    height: '5px',
    order: '2'
  };
  return (
      <div style={boxStyle}>
        
        {<div style={boxStyle2}></div>}
      </div>/* Your content goes here */
  );
}
function anotherthing(props){
  const boxStyle = {
    borderRadius: '10px',
    background: '#FFFFFF',
    padding: '0px',
    width: '50px',
    height: '70px',
    left:'30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom:'5px'
  };
  return(
    <div style={boxStyle}>
      <div class="image" >
        <img src={require(`./${props.name}.png`)} alt="Tomato" style={{
    borderRadius: '10px', 
    width: '50px',
    height: '50px',maxWidth: '100%', maxHeight: '100%' }} />
        </div>
        <div onClick={props.handleClick}>
      {RoundedCornerBox( {ratio:props.ratio,color:props.color})}
      </div>
    </div>
  )
}
//values=[0.0713733333333332,0.014415,0.019066666666666583,0.18,0.02166666666666658,1.2917999999999998,0.6525]
const nutrientlist=['nutrient1','nutrient3','nutrient5','nutrient6','nutrient7','nutrient8','nutrient9','nutrient10']
function App() {
  const [nutrient, setNutrient] = useState(0);
  const ids=[2505,2380,2460,501098,2344,6040,841];
  const unit_weights=[2.12,0.93,1.3,9,1.3,3.6,1.74];
  const nutrients={
    nutrient1:{name:'protein',id:203,color:'#9A1EBA',value:[0.0713733333333332,0.014415,0.019066666666666583,0.18,0.02166666666666658,1.2917999999999998,0.6525]},
    //nutrient2:{name:'Va',id:0,value:[0.0, 0.000835, 0, 0, 0, 0, 0]},
    //nutrient11:{name:'Vb',id:0,value:[0.0, 0.0, 0.0, 0.0, 0.0, 0.9125, 0.0875]},
    nutrient3:{name:'Vc',id:401,color:'#ED732E',value:[0.46404444444444426,0.06096666666666662,0.19788888888888886,2.5,2.6505555555555556,0.0,0.0]},
    //nutrient4:{name:'Vk',id:430},
    nutrient5:{name:'cal',id:301,color:'#ADC5FA',value:[0.02544,0.030690000000000002,0.013000000000000001,0.38699999999999996,0.0143,0.0252,0.0087]},
    nutrient6:{name:'iron',id:303,color:'#781E0D',value:[0.20670000000000002,0.034875,0.043875000000000004,0.33749999999999997,0.07475000000000001,0.9225,0.080475]},
    nutrient7:{name:'magnesium',id:304,color:'#4724AB',value:[0.13544444444444426,0.03099999999999997,0.03972222222222215,0.3499999999999992,0.043333333333333286,0.25999999999999995,0.1353333333333332]},
    nutrient8:{name:'zinc',id:309,color:'#53340D',value:[0.06831111111111107,0.024799999999999937,0.024555555555555438,0.1999999999999998,0.024555555555555438,1.5759999999999998,0.13146666666666657]},
    nutrient9:{name:'Potassium',id:306,color:'#53340D',value:[0.18989787234042538,0.06331914893617019,0.06555319148936169,0.4844680851063825,0.05863829787234042,0.24817021276595722,0.12365106382978715]},
    nutrient10:{name:'phosphorus',id:305,color:'#53340D',value:[0.04028,0.010849999999999938,0.010400000000000001,0.11999999999999969,0.010400000000000001,0.2423999999999999,0.12353999999999998]}
  }
  const a=[0.20670000000000002,0.34875,0.043875000000000004,0.33749999999999997,0.07475000000000001,0.9225,0.080475]
  
  const items = {
    item1: { name: 'carrot', foodindex: 1,imagepath:'/static/media/carrot_striped.png'},
    item2: { name: 'tomato', foodindex:2,imagepath:'./tomato_striped.png'},
    item3: { name: 'steak', foodindex:5,imagepath:'./tomato_striped.png'},
    item4: { name: 'bellpepper', foodindex: 4,imagepath:'/static/media/carrot_striped.png'},
    item5: { name: 'cabbage', foodindex: 3,imagepath:'/static/media/carrot_striped.png'},
    item6: { name: 'potato', foodindex:0,imagepath:'./tomato_striped.png'}
  };
  


function handleClick() {
  setNutrient(prevNutrient => (prevNutrient + 1) % nutrientlist.length);
  console.log("clicked"+`${nutrient+1}`);
}
  return (
    <div>
    <div className="responsive-container" style={{display:'grid',gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',gridGap: '10px'}}>
      {Object.keys(items).map((key) => (
        <div className="responsive-item">
          {anotherthing({ handleClick:handleClick,name: items[key].name, color:nutrients[nutrientlist[nutrient]].color,ratio: nutrients[nutrientlist[nutrient]].value[items[key].foodindex] })}
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;
