import useWindowSize from "../../src/hooks/useWindowSize";

function Player({
  width,
  coordinates,
}: {
  width: number;
  coordinates: ICoordinates;
}) {
  return (
    <div style={{ position: "absolute" }}>
      <img
        width={width < 50 ? width - 15 : width - 25}
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
