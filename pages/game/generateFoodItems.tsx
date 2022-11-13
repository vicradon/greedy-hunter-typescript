import { ReactElement } from "react";
import Food from "./Food";

type PropTypes = {
  gridArray: string[][];
  SCALE: number;
  squareUnit: number;
  grid: number;
};

const generateFoodItems = ({
  gridArray,
  SCALE,
  squareUnit,
  grid,
}: PropTypes) => {
  const foodItems: ReactElement[] = [];
  gridArray.forEach((row, rowIndex) => {
    row.forEach((item, colIndex) => {
      if (item === "x") {
        foodItems.push(
          <Food
            key={`${rowIndex}-${colIndex}`}
            width={grid * SCALE}
            coordinates={{
              x: rowIndex * squareUnit,
              y: colIndex * squareUnit,
            }}
          />
        );
      }
    });
  });

  return foodItems;
};

export default generateFoodItems;
