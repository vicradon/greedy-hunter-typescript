import styles from "./Alert.module.scss";

type setAlertType = {
  display: boolean;
  content: string;
};

type AlertType = {
  content: string;
  setAlert: (props: setAlertType) => void;
};

function Alert({ content, setAlert }: AlertType) {
  return (
    <div className={styles.main}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p>Alert</p>
        <button
          onClick={() => setAlert({ display: false, content: "" })}
          className={styles.close_wrapper}
        >
          &times;
        </button>
      </div>
      <p className={styles.content}>{content}</p>
    </div>
  );
}

export default Alert;
