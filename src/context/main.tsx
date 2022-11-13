import { createContext, Dispatch, useContext, useReducer } from "react";

const initialState = {
  grid_side: 10,
  previous_game_stats: {
    eaten_food: 0,
    total_food: 0,
    elapsed_seconds: 0,
  },
};

type ACTIONTYPE =
  | { type: "SET_GRID_SIDE"; payload: { grid_side: number } }
  | {
      type: "END_GAME";
      payload: {
        eaten_food: number;
        total_food: number;
        elapsed_seconds: number;
      };
    };

const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
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

type AppProviderProps = {
  children: React.ReactNode;
};

const StateContext = createContext(initialState);
const DispatchContext = createContext<Dispatch<ACTIONTYPE>>(() => {});

const AppProvider = (props: AppProviderProps) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useGlobalState = () => useContext(StateContext);
export const useGlobalDispatch = () => useContext(DispatchContext);

export default AppProvider;
