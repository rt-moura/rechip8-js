function reducer(state = {}, action)
{
  switch (action.type) {
    case 'updateInstructions':

      // Store a maximum of 18 instructions
      if(state.instructions && state.instructions.length > 17)
        state.instructions = state.instructions.slice(-17);

      let instructionState = {
        ...state, 
        instructions: 
        (state.instructions) ? [...state.instructions, action.payload] : [action.payload]
      };

      return instructionState;
    case 'updateRegisters':
      return {...state, registers: action.payload};
      case 'updateRomData':
      return {...state, romData: action.payload};
    case 'reset':
      return {};
    default:
      return state;
  }
}

export default reducer;