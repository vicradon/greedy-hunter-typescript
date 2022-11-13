import { createContext, useContext, useReducer } from "react";

const initialState = {
    grid_side: 10,
    previous_game_stats: {
      eaten_food: 0,
      total_food: 0,
      elapsed_seconds: 0,
    },
  };

// interface AppContextInterface {
//   grid_side: number;
//   previous_game_stats: {
//     eaten_food: number;
//     total_food: number;
//     elapsed_seconds: number;
//   }
// }

// type ACTIONTYPE =
//   | { type: "SET_GRID_SIDE"; payload: number }
//   | { type: "END_GAME"; payload: {
//     eaten_food: number;
//     total_food: number;
//     elapsed_seconds: number;
//   } };

  
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_GRID_SIDE": {
      return {
        ...state,
        grid_side: action.payload.grid_side,
      };
    }
    case "END_GAME": {
      return {
        ...state,
        previous_game_stats: {
          eaten_food: action.payload.eaten_food,
          total_food: action.payload.total_food,
          elapsed_seconds: action.payload.elapsed_seconds,
        },
      };
    }
    default:
      return state;
  }
};

// type StoreProps = {
//   children: React.ReactNode
// }



// const appContext: AppContextInterface = {
//   grid_side: 10,
//   previous_game_stats: {
//     eaten_food: 0,
//     total_food: 0,
//     elapsed_seconds: 0,
//   },
// }

const Store = (props) => {
  const {children} = props
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={state}>
      <Context.Provider value={dispatch}>
        {children}
      </Context.Provider>
    </Context.Provider>
  );
};

const StateContext = createContext(initialState);
const DispatchContext = createContext()

export const useGlobalState = () => useContext(StateContext)
export const useGlobalDispatch = () => useContext(DispatchContext)

export default Store;
