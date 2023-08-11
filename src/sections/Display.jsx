import { useEffect } from "react"
import CHIP8 from "../hardware/chip8"
import ROMS from "../data/ROM_SET"
import '../styles/display.css'

function Display()
{
    //Passing to CHIP8 constructor the reference to Redux dispatch hook
    const myChip8 = new CHIP8();

    let romName;
    let romData;

    let displayCols = new Array(64).fill();
    let displayRows = new Array(32).fill();

    function loadFile(e)
    {
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onload = function() {
        const romBuffer = Array.from(new Uint8Array(this.result))
        romData = romBuffer;
        romName = file.name;

        // React state would reload all the component and init over and over chip8 class causing a bug 
        if(romName)
          document.getElementById('startButton').innerText = 'Start: ' + romName.substring(0, 7) + '...';
      }
      if(file)
        reader.readAsArrayBuffer(file);
      }

    // componentDidMount
    useEffect(() => {
        let canvas = document.querySelector('canvas');

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }, []);

    return (
    <section id="displaySec" className='sub1'>
    <div id="canvas_container">
      <div id="hCanvasGrid">
      <table>
        <tbody>
        <tr>
          {displayCols.map((v, i) => {
            return <td key={i}>{i}</td>
          })}
        </tr>
        </tbody>
      </table>
      </div>
      <div id="vCanvasGrid">
      <table>
        <tbody>
          {displayRows.map((v, i) => {
            return <tr key={i}><td>{i}</td></tr>
          })}
        </tbody>
      </table>
      </div>
      <canvas></canvas>
    </div>
    <div className="vLine"></div>

    <aside>
      <h5>Load a Game</h5>
      <label htmlFor="gamelist">Game list</label>
      <select name="gamelist" id="gamelist" defaultValue="default" onChange={(e) => {
        romData = ROMS[e.target.value].romData;
        romName = ROMS[e.target.value].romName;

        // React state would reload all the component and init over and over chip8 class causing a bug 
        if(romName)
          document.getElementById('startButton').innerText = 'Start: ' + romName.substring(0, 7) + '...';
        }}>
        <option value="default" disabled>Choose a game</option>
        {
          ROMS.map((ROM, key) => {
            return (<option key={key} value={key}>{ROM.romName}</option>);
          })
        }
      </select>

      <label htmlFor="fileInput">Load a file</label>
      <input type="file" name="fileInput" id="fileInput" accept=".ch8" onChange={ loadFile }/>

      <button type="button" id="startButton" onClick={ () => myChip8.start(romData) }>Start</button>
      
      <label htmlFor="gameTips">Play with keys:</label>
      <div id="gameTips">
          1 2 3 4 <br />
          Q W E R <br />
          A S D F <br />
          Z X C V <br />
      </div>
      <label htmlFor="volume">Volume:</label>
      <input type="range" id="volume" name="volume" defaultValue='5' min="0" max="100" onChange={ (e) => myChip8.changeVolume(e.target.value) }/>

      <div className="hLine"></div>
      <h5>Debug Menu</h5>
      <div id="debugContainer">
        <label htmlFor="debugCheckbox">Debug Mode:</label>
        <input type="checkbox" id="debugCheckbox" name="debugCheckbox" onChange={ (e) => myChip8.debugMode(e.target.checked) }/>

        <label htmlFor="gridCheckbox">Show Display Grid:</label>
        <input type="checkbox" id="gridCheckbox" name="gridCheckbox" disabled onChange={ (e) => myChip8.showDisplayGrid(e.target.checked) }/>
        <button type="button" id="nextButton" onClick={() => {myChip8.nextStep()}}>Next Instruction</button>
      </div>
    </aside>
  </section>
  );
}

export default Display;