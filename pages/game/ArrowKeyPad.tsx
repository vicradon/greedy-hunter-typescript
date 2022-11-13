import styles from "./ArrowKeyPad.module.scss";

function ArrowKeyPad({
  handleKeyDown,
}: {
  handleKeyDown: (event: KeyboardEvent) => void;
}) {
  return (
    <div className={styles.main}>
      <div className="d-flex justify-content-center">
        <button onClick={() => handleKeyDown(38)}>&uarr;</button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <button onClick={() => handleKeyDown(37)}>&larr;</button>
        <button onClick={() => handleKeyDown(40)}>&darr;</button>
        <button onClick={() => handleKeyDown(39)}>&rarr;</button>
      </div>
    </div>
  );
}

export default ArrowKeyPad;
