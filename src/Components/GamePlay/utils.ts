import { ICoordinates } from "../../../pages/game";

export const generateGridArray = (gridSize: number) => {
  const gridArray = Array(gridSize)
    .fill(0)
    .map((_) => Array(gridSize).fill(0));

  Array(gridSize)
    .fill("x")
    .forEach((foodItem) => {
      let randomIndex1 = Math.floor(Math.random() * gridSize);
      let randomIndex2 = Math.floor(Math.random() * gridSize);

      while (
        gridArray[randomIndex1][randomIndex2] === foodItem ||
        gridArray[randomIndex1][randomIndex2] === "player"
      ) {
        randomIndex1 = Math.floor(Math.random() * gridSize);
        randomIndex2 = Math.floor(Math.random() * gridSize);
      }
      gridArray[randomIndex1][randomIndex2] = foodItem;
    });

  return gridArray;
};

export const getNextCoordinates = (
  eventCode: string,
  coordinates: ICoordinates,
  squareUnit: number,
  gridEdge: number
) => {
  // left
  if (
    (eventCode === "ArrowLeft" || eventCode === "KeyA") &&
    coordinates.x - squareUnit >= 0
  ) {
    return { ...coordinates, x: coordinates.x - squareUnit };
  }
  // top
  if (
    (eventCode === "ArrowUp" || eventCode === "KeyW") &&
    coordinates.y - squareUnit >= 0
  ) {
    return { ...coordinates, y: coordinates.y - squareUnit };
  }
  // right
  if (
    (eventCode === "ArrowRight" || eventCode === "KeyD") &&
    coordinates.x + squareUnit < gridEdge
  ) {
    return { ...coordinates, x: coordinates.x + squareUnit };
  }
  // bottom
  if (
    (eventCode === "ArrowDown" || eventCode === "KeyS") &&
    coordinates.y + squareUnit < gridEdge
  ) {
    return { ...coordinates, y: coordinates.y + squareUnit };
  }

  return coordinates;
};

export const formatSecondsToTimeString = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(14, 5);
};
