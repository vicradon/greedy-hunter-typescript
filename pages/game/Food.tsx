import useWindowSize from "../../src/hooks/useWindowSize";
import { ICoordinates } from "./Player";

function Food({
  width,
  coordinates,
}: {
  width: number;
  coordinates: ICoordinates;
}) {
  return (
    <img
      width={width < 50 ? width - 15 : width - 25}
      style={{
        position: "absolute",
        paddingTop: width < 50 ? ".5rem" : ".8rem",
        paddingLeft: width < 50 ? ".5rem" : ".9rem",
        marginLeft: `${coordinates.x}px`,
        marginTop: `${coordinates.y}px`,
      }}
      src={"/assets/icons/food.svg"}
      alt="food"
    />
  );
}

export default Food;
