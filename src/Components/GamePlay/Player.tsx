import Image from "next/image";
import { ICoordinates } from "../../../pages/game";

function Player({
  width,
  coordinates,
}: {
  width: number;
  coordinates: ICoordinates;
}) {
  const imgWidth = width < 50 ? width - 15 : width - 25;
  return (
    <div style={{ position: "absolute" }}>
      <Image
        width={imgWidth}
        height={imgWidth}
        style={{
          paddingTop: width < 50 ? ".5rem" : ".8rem",
          paddingLeft: width < 50 ? ".5rem" : ".9rem",
          marginLeft: `${coordinates.x}px`,
          marginTop: `${coordinates.y}px`,
        }}
        src={"/assets/icons/character.svg"}
        alt="player"
      />
    </div>
  );
}
export default Player;
