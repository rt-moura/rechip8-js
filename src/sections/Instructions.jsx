import { useSelector } from "react-redux"
import '../styles/instructions.css'

function Instructions()
{
  const instructions = useSelector(state => state.instructions);
  const registers = useSelector(state => state.registers);
  
    return (
        <section id="instrSec" className='sub1'>
        <h5  onClick={() => console.log(instructions)}>Instructions</h5>
        <div className="hLine"></div>
        <div id="instrContainer">
        {(instructions) ? 
          <table id="instrTable">
            {/* <thead>
              <tr>
                <th>Addr</th>
                <th>Opcode</th>
                <th>Name</th>
                <th>Args</th>
              </tr>
            </thead> */}
          <tbody>
          {instructions.map((row, i) => {
            return (
              <tr key={i}>
                <td>{row.address}</td>
                <td>{row.opcode}</td>
                <td>{row.name}</td>
                <td>{row.args.map((v, i, arr) => (i === arr.length -1) ? v : v + ';')}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
        : null}
        </div>
        <div className='hLine'></div>
        <h5>Registers <small>(Hexadecimal)</small></h5>
        <div className="hLine"></div>
        <div id="registersContainer">
          <table>
              <tbody>
                <tr>
                  <td>V0:</td>
                  <td>{registers ? registers.registers[0] : null}</td>
                </tr>
                <tr>
                  <td>V1:</td>
                  <td>{registers ? registers.registers[1] : null}</td>
                </tr>
                <tr>
                  <td>V2:</td>
                  <td>{registers ? registers.registers[2] : null}</td>
                </tr>
                <tr>
                  <td>V3:</td>
                  <td>{registers ? registers.registers[3] : null}</td>
                </tr>
                <tr>
                  <td>V4:</td>
                  <td>{registers ? registers.registers[4] : null}</td>
                </tr>
                <tr>
                  <td>V5:</td>
                  <td>{registers ? registers.registers[5] : null}</td>
                </tr>
                <tr>
                  <td>V6:</td>
                  <td>{registers ? registers.registers[6] : null}</td>
                </tr>
                <tr>
                  <td>V7:</td>
                  <td>{registers ? registers.registers[7] : null}</td>
                </tr>
                <tr>
                  <td>V8:</td>
                  <td>{registers ? registers.registers[8] : null}</td>
                </tr>
                <tr>
                  <td>V9:</td>
                  <td>{registers ? registers.registers[9] : null}</td>
                </tr>
              </tbody>
          </table>
          <div className="vLine"></div>
          <table>
              <tbody>
                <tr>
                  <td>VA:</td>
                  <td>{registers ? registers.registers[10] : null}</td>
                </tr>
                <tr>
                  <td>VB:</td>
                  <td>{registers ? registers.registers[11] : null}</td>
                </tr>
                <tr>
                  <td>VC:</td>
                  <td>{registers ? registers.registers[12] : null}</td>
                </tr>
                <tr>
                  <td>VD:</td>
                  <td>{registers ? registers.registers[13] : null}</td>
                </tr>
                <tr>
                  <td>VE:</td>
                  <td>{registers ? registers.registers[14] : null}</td>
                </tr>
                <tr>
                  <td>VF:</td>
                  <td>{registers ? registers.registers[15] : null}</td>
                </tr>
                <tr>
                  <td>ST:</td>
                  <td>{registers ? registers.ST : null}</td>
                </tr>
                <tr>
                  <td>DT:</td>
                  <td>{registers ? registers.DT : null}</td>
                </tr>
                <tr>
                  <td>SP:</td>
                  <td>{registers ? registers.SP : null}</td>
                </tr>
                <tr>
                  <td>I:</td>
                  <td>{registers ? registers.I : null}</td>
                </tr>
              </tbody>
          </table>
        </div>
        <div className="hLine"></div>
        <div id="indexRegisterContainer">
              <span>PC:</span>
              <span>{registers ? registers.PC : null}</span>
        </div>
      </section>
    );
}

export default Instructions;