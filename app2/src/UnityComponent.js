import React from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

function UnityComponent({ loaderUrl, dataUrl, frameworkUrl, codeUrl }) {
  const { unityProvider } = useUnityContext({
    loaderUrl: "Build-Unity.loader.js",
    dataUrl: "Build-Unity.data",
    frameworkUrl: "Build-Unity.framework.js",
    codeUrl: "Build-Unity.wasm"//,
    //streamingAssetsUrl: "StreamingAssets"
  });
  function handleClickSpawnEnemies(func) {
    sendMessage("GameController", func, 100);
  }
  const { addEventListener, removeEventListener } = useUnityContext();
  const [score, setScore] = useState();

  const handleSetScore = useCallback((score) => {
    // Do something with the score
  }, []);
  
  useEffect(() => {
    addEventListener("SetScore", handleSetScore);
    return () => {
      removeEventListener("SetScore", handleSetScore);
    };
  }, [addEventListener, removeEventListener, handleSetScore]);
  
  return <div>
    <Unity unityProvider={unityProvider} style={{ height: 600, width: 800 }} />
    </div>;
}

export default React.memo(UnityComponent);