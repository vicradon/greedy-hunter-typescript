import styles from "./ArrowKeyPad.module.scss";

export type DPadDirections =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight";

function ArrowKeyPad({
  handleDPad,
}: {
  handleDPad: (direction: DPadDirections) => void;
}) {
  return (
    <div className={styles.main}>
      <div className="d-flex justify-content-center">
        <button onClick={() => handleDPad("ArrowUp")}>&uarr;</button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <button onClick={() => handleDPad("ArrowLeft")}>&larr;</button>
        <button onClick={() => handleDPad("ArrowDown")}>&darr;</button>
        <button onClick={() => handleDPad("ArrowRight")}>&rarr;</button>
      </div>
    </div>
  );
}

export default ArrowKeyPad;
