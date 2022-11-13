import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Player from "./Player";
import useWindowSize from "../../src/hooks/useWindowSize";
import Alert from "./Alert";
import ArrowKeyPad from "./ArrowKeyPad";
import formatSecondsToTimeString from "./formatSecondsToTimeString";
import styles from "./GamePlay.module.scss";
import generateFoodItems from "./generateFoodItems";
import { useGlobalDispatch, useGlobalState } from "../../src/context/main";

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

  const grid = grid_side;
  const maxMoves = Math.ceil(grid * grid * 0.2);

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

  const SCALE = width > 576 ? normalScales[grid] : smallScales[grid];
  const squareUnit = grid * SCALE;
  const gridEdge = grid * grid * SCALE;
  const router = useRouter();

  const handleEndGame = () => {
    dispatch({
      type: "END_GAME",
      payload: {
        eaten_food: grid - foodItems.length,
        total_food: grid,
        elapsed_seconds: elapsedSeconds,
      },
    });
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (totalMoves === maxMoves) {
      handleEndGame();

      router.replace("/game-over");
    }
    let tempCoordinates = { ...coordinates };

    // left
    if (
      (event.code === "ArrowLeft" || event.code === "KeyA") &&
      coordinates.x - squareUnit >= 0
    ) {
      tempCoordinates = { ...coordinates, x: coordinates.x - squareUnit };
      setTotalMoves(totalMoves + 1);
    }
    // top
    if (
      (event.code === "ArrowUp" || event.code === "KeyW") &&
      coordinates.y - squareUnit >= 0
    ) {
      tempCoordinates = { ...coordinates, y: coordinates.y - squareUnit };
      setTotalMoves(totalMoves + 1);
    }
    // right
    if (
      (event.code === "ArrowRight" || event.code === "KeyD") &&
      coordinates.x + squareUnit < gridEdge
    ) {
      tempCoordinates = { ...coordinates, x: coordinates.x + squareUnit };
      setTotalMoves(totalMoves + 1);
    }
    // bottom
    if (
      (event.code === "ArrowDown" || event.code === "KeyS") &&
      coordinates.y + squareUnit < gridEdge
    ) {
      tempCoordinates = { ...coordinates, y: coordinates.y + squareUnit };
      setTotalMoves(totalMoves + 1);
    }
    handleFoodIntake(tempCoordinates);
    setCoordinates(tempCoordinates);
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
        grid,
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
    const generateGridArray = () => {
      const gridArray = Array(grid)
        .fill(0)
        .map((_) => Array(grid).fill(0));

      const randomIndex1 = Math.floor(Math.random() * grid);
      const randomIndex2 = Math.floor(Math.random() * grid);

      gridArray[randomIndex1][randomIndex2] = "player";
      setCoordinates({
        x: randomIndex1 * squareUnit,
        y: randomIndex2 * squareUnit,
      });

      Array(grid)
        .fill("x")
        .forEach((foodItem) => {
          let randomIndex1 = Math.floor(Math.random() * grid);
          let randomIndex2 = Math.floor(Math.random() * grid);

          while (
            gridArray[randomIndex1][randomIndex2] === foodItem ||
            gridArray[randomIndex1][randomIndex2] === "player"
          ) {
            randomIndex1 = Math.floor(Math.random() * grid);
            randomIndex2 = Math.floor(Math.random() * grid);
          }
          gridArray[randomIndex1][randomIndex2] = foodItem;
        });

      return gridArray;
    };

    const gridArray = generateGridArray();
    const foodItems = generateFoodItems({ gridArray, SCALE, squareUnit, grid });

    setFoodItems(foodItems);
    setGridArray(gridArray);
  }, [grid, squareUnit, SCALE]);

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

  const handleSetAlert = () => {};

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
              {grid} x {grid}
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
            width: `${grid * grid * SCALE + 2}px`,
          }}
          className={styles.game_board_wrapper}
        >
          <div
            style={{
              backgroundSize: `${grid * SCALE}px ${grid * SCALE}px`,
              height: `${grid * grid * SCALE + 2}px`,
            }}
            className={styles.game_board}
          >
            <>
              <Player coordinates={coordinates} width={grid * SCALE} />
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
      {/* {isMobileBrowser && <ArrowKeyPad handleKeyDown={handleKeyDown} />} */}
      {alert.display && <Alert content={alert.content} setAlert={setAlert} />}
    </div>
  );
}

export default GamePlay;
