import React, { Fragment, useState, useCallback, useEffect } from "react"
import { Unity, useUnityContext } from 'react-unity-webgl';

function UnityComponent(props) {
  const { unityProvider , addEventListener, removeEventListener,sendMessage } = useUnityContext({
    loaderUrl: "Build-Unity.loader.js",
    dataUrl: "Build-Unity.data",
    frameworkUrl: "Build-Unity.framework.js",
    codeUrl: "Build-Unity.wasm"//,
    //streamingAssetsUrl: "StreamingAssets"
  });
  function handleClickSpawnEnemies() {
    sendMessage("GameController", "SpawnEnemies", 100);
  }

  const handlemyfunction = useCallback((functioncode, data) => {
    switch (functioncode) {
      case "value1":
        // code block to execute if expression matches value1
        break;
      default:
        props.parentCallBack(functioncode,data)
        console.log("functioncode"+functioncode+", data"+data);
        // code block to execute if none of the cases match
    }
    
  }, []);

  useEffect(() => {
    addEventListener("myFunction", handlemyfunction);
    return () => {
      removeEventListener("myFunction", handlemyfunction);
    };
  }, [addEventListener, removeEventListener, handlemyfunction]);

  
  return (
  <div>
    <Unity unityProvider={unityProvider} style={{ height: 600, width: 800 }} />
    <button onClick={handleClickSpawnEnemies}>but1</button>
    </div>
    );
}

export default React.memo(UnityComponent);
