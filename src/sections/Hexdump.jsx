import { useSelector } from "react-redux"
import { createHexdump } from '../utils/hex'
import '../styles/hexdump.css'

function Hexdump()
{
  const romData = useSelector(state => state.romData);

    return (
        <section id="hexdSec" className='sub1'>
        <article>
          <h5>Rom Data</h5>
          {(romData) ? 
            <table id="hexdTable">
            <tbody>
              {createHexdump(romData).map((row, i) => {
                return (<tr key={i}>
                  <td>{row[0]}</td>
                  <td>{row[1].map((hex, i) => {
                    return ((i % 2) !== 0) ? hex + ' ' : hex;
                    })}</td>
                  <td>{row[2]}</td>
                  </tr>);
              })}
            </tbody>
          </table>
          : null}
        </article>
      </section>
    );
}

export default Hexdump;