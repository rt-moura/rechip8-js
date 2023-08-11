function toHex(value, length = 1)
{
  return value.toString(16).padStart(length, 0).toUpperCase();
}

function hex2Ascii(data)
{
    let hex = data.toString();
    let str = '';
    let nullCharacter = '.'; // show this instead of invisible characters
    for (let i = 0; i < hex.length; i += 2)
    {
      let charCode = parseInt(hex.substr(i, 2), 16);
      
      //Show only visible characters
      str += ((charCode < 32) || (charCode > 126)) ? nullCharacter : String.fromCharCode(charCode);
    }
    return str;
}

function createHexdump(buffer)
{
    let data = [];
    let hexRow = [];
    let asciiRow = [];
    const bytesPerRow = 32; // number of bytes per row
    const rowSizeColumnDigits = 8; // Length of the row size column
    let bytesCounter = 0;
  
    buffer.forEach((value, index, arr) => {
  
      let hexValue = toHex(value, 2);
  
      if(hexRow.length < bytesPerRow)
      {
        hexRow.push(hexValue);
        asciiRow.push(hex2Ascii(hexValue));
  
        if((index === arr.length-1) && (hexRow.length > 0)) //EOF && row is not empty
        {
          // +1 because it's the final iteration
          data.push([toHex(((bytesCounter+1)-bytesPerRow), rowSizeColumnDigits), hexRow, asciiRow]);
          hexRow = [];
          asciiRow = [];
        }
      }
      else
      {
        data.push([toHex((bytesCounter-bytesPerRow), rowSizeColumnDigits), hexRow, asciiRow]);
        
        hexRow = [];
        asciiRow = [];

        hexRow.push(hexValue)
        asciiRow.push(hex2Ascii(hexValue));
      }
      bytesCounter++;
    });
  
    return data;
}

export { toHex, hex2Ascii, createHexdump }
