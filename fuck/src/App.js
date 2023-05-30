import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "Build/public.loader.js",
    dataUrl: "Build/public.data",
    frameworkUrl: "Build/public.framework.js",
    codeUrl: "Build/public.wasm",
  });

  function handleClickSpawnEnemies() {
    sendMessage("controller", "ReactSlice", 3);
  }
  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    console.log('Selected option:', selectedOption);
    sendMessage("controller", "ReactAddPrefab", selectedOption);
  };
  function handleClick1(){
    sendMessage("controller", "ReactScroll", -1);
  }
  function handleClick2(){
    sendMessage("controller", "ReactScroll", 1);
  }
  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickSpawnEnemies}>Spawn Enemies</button>
      <button onClick={handleClick1}>left</button>
      <button onClick={handleClick2}>right</button>
      <label htmlFor="dropdown">Select an option:</label>
      <select id="dropdown" onChange={handleSelectChange}>
        <option value="">-- Select --</option>
        <option value="carrot">carrot</option>
        <option value="steak">steak</option>
        <option value="potato">potato</option>
        <option value="tomato">tomato</option>
      </select>
    </Fragment>
  );
}


export default App;