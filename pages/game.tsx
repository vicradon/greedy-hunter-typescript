import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Player from "../src/Components/GamePlay/Player";
import useWindowSize from "../src/hooks/useWindowSize";
import Alert from "../src/Components/GamePlay/Alert";
import ArrowKeyPad, {
  DPadDirections,
} from "../src/Components/GamePlay/ArrowKeyPad";
import styles from "../src/Components/GamePlay/GamePlay.module.scss";
import generateFoodItems from "../src/Components/GamePlay/generateFoodItems";
import { useGlobalDispatch, useGlobalState } from "../src/context/main";
import {
  generateGridArray,
  getNextCoordinates,
  formatSecondsToTimeString,
} from "../src/Components/GamePlay/utils";

export interface ICoordinates {
  x: number;
  y: number;
}

function GamePlay() {
  const [alert, setAlert] = useState({ display: false, content: "" });
  const { grid_side } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { width, height } = useWindowSize();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gridArray, setGridArray] = useState<string[][]>([]);
  const [foodItems, setFoodItems] = useState<ReactElement[]>([]);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [totalMoves, setTotalMoves] = useState(0);
  const isMobileBrowser = width <= 800 && height <= 600;

  const gridSize = grid_side;
  const maxMoves = Math.ceil(gridSize * gridSize * 0.2);

  const smallScales: { [key: string]: number } = {
    5: 11,
    6: 7,
    7: 5,
    8: 4.3,
    9: 3.5,
    10: 2.8,
    11: 2.4,
    12: 1.9,
  };

  const normalScales: { [key: string]: number } = {
    5: 13,
    6: 11,
    7: 9,
    8: 7,
    9: 5,
    10: 4,
    11: 3.5,
    12: 3,
  };

  const SCALE = width > 576 ? normalScales[gridSize] : smallScales[gridSize];
  const squareUnit = gridSize * SCALE;
  const gridEdge = gridSize * gridSize * SCALE;
  const router = useRouter();

  const handleEndGame = () => {
    dispatch({
      type: "END_GAME",
      payload: {
        eaten_food: gridSize - foodItems.length,
        total_food: gridSize,
        elapsed_seconds: elapsedSeconds,
      },
    });
  };
  const handleKeyDown = (prop: KeyboardEvent | DPadDirections) => {
    if (totalMoves === maxMoves) {
      handleEndGame();
      router.replace("/game-over");
    }

    const eventCode = prop instanceof KeyboardEvent ? prop.code : prop;

    const newCoordinates = getNextCoordinates(
      eventCode,
      coordinates,
      squareUnit,
      gridEdge
    );

    if (JSON.stringify(coordinates) !== JSON.stringify(newCoordinates)) {
      setTotalMoves(totalMoves + 1);
    }
    handleFoodIntake(newCoordinates);
    setCoordinates(newCoordinates);
  };

  const handleFoodIntake = (coordinates: ICoordinates) => {
    const rowIndex = Math.ceil(coordinates.x / squareUnit);
    const colIndex = Math.ceil(coordinates.y / squareUnit);

    if (gridArray[rowIndex][colIndex] === "x") {
      const newGridArray = JSON.parse(JSON.stringify(gridArray));
      newGridArray[rowIndex][colIndex] = 0;
      setGridArray(newGridArray);
      const foodItems = generateFoodItems({
        gridArray: newGridArray,
        SCALE,
        squareUnit,
        grid: gridSize,
      });
      if (!foodItems.length) {
        handleEndGame();
        router.replace("/game-won");
      }
      setFoodItems(foodItems);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(elapsedSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [elapsedSeconds]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    const gridArray = generateGridArray(gridSize);
    const foodItems = generateFoodItems({
      gridArray,
      SCALE,
      squareUnit,
      grid: gridSize,
    });

    const randomIndex1 = Math.floor(Math.random() * gridSize);
    const randomIndex2 = Math.floor(Math.random() * gridSize);

    gridArray[randomIndex1][randomIndex2] = "player";
    setCoordinates({
      x: randomIndex1 * squareUnit,
      y: randomIndex2 * squareUnit,
    });

    setFoodItems(foodItems);
    setGridArray(gridArray);
  }, [gridSize, squareUnit, SCALE]);

  useEffect(() => {
    const movement_instruction_displayed = JSON.parse(
      localStorage.getItem("movement_instruction_displayed") || ""
    );

    if (isMobileBrowser && !movement_instruction_displayed) {
      setAlert({ display: true, content: "Use arrow keypad to move" });
      localStorage.setItem("movement_instruction_displayed", String(true));
    }

    if (!isMobileBrowser && !movement_instruction_displayed) {
      setAlert({ display: true, content: "Use WASD or Arrow Keys to move" });
      localStorage.setItem("movement_instruction_displayed", String(true));
    }
  }, [isMobileBrowser]);

  return (
    <div className={styles.main}>
      <div
        style={{ maxWidth: "100%" }} // `${grid * grid * SCALE + 2}px` }}
        className={styles.game_card}
      >
        <div className="d-flex justify-content-between aling-items-center">
          <p>
            Grid:
            <span className="bold ml-2">
              {gridSize} x {gridSize}
            </span>
          </p>
          <p>
            Time spent:
            <span className="bold ml-2">
              {formatSecondsToTimeString(elapsedSeconds)} secs
            </span>
          </p>
        </div>
        <div
          style={{
            width: `${gridSize * gridSize * SCALE + 2}px`,
          }}
          className={styles.game_board_wrapper}
        >
          <div
            style={{
              backgroundSize: `${gridSize * SCALE}px ${gridSize * SCALE}px`,
              height: `${gridSize * gridSize * SCALE + 2}px`,
            }}
            className={styles.game_board}
          >
            <>
              <Player coordinates={coordinates} width={gridSize * SCALE} />
              {foodItems}
            </>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <p>
            Maximum moves:
            <span className="bold ml-2">{maxMoves}</span>
          </p>
          <p>
            Total moves:
            <span className="bold ml-2">{totalMoves}</span>
          </p>
        </div>
      </div>
      {isMobileBrowser && <ArrowKeyPad handleDPad={handleKeyDown} />}
      {alert.display && <Alert content={alert.content} setAlert={setAlert} />}
    </div>
  );
}

export default GamePlay;
