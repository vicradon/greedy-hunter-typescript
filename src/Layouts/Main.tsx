import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useGlobalDispatch, useGlobalState } from "../context/main";
import styles from "./Main.module.scss";

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout(props: MainLayoutProps) {
  const { children } = props;
  const [selectShouldBeWhite, setSelectShouldBeWhite] = useState(true);
  const { grid_side } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const [gridSide, setGridSide] = useState(grid_side);

  const router = useRouter();

  const startGame = (event: FormEvent) => {
    event.preventDefault();
    dispatch({
      type: "SET_GRID_SIDE",
      payload: { grid_side: gridSide },
    });
    router.push("/game");
  };

  const pathname = router.pathname;

  return (
    <div className={styles.main}>
      <section className={styles.left_dot_grid}></section>
      <section className={styles.content}>
        <Image
          className={`mb-6 ${styles.game_character}`}
          src={"/assets/icons/character.svg"}
          alt="Game Character"
          width={200}
          height={200}
        />

        <div className="mb-6">{children}</div>

        <form onSubmit={startGame}>
          <div className="d-flex align-items-center justify-content-center mb-8 mt-8">
            <p className={`mr-4 ${styles.grid_selector_text}`}>Game grid</p>
            <select
              onChange={(event: React.FormEvent<HTMLSelectElement>) =>
                setGridSide(Number(event.currentTarget.value))
              }
              value={gridSide}
              name="game_grid"
              className={styles.grid_select}
              style={{ color: selectShouldBeWhite ? "white" : "black" }}
              onMouseOver={() => setSelectShouldBeWhite(false)}
              onMouseOut={() => setSelectShouldBeWhite(true)}
            >
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <option value={index + 5} key={index}>
                    {index + 5}
                  </option>
                ))}
            </select>
          </div>

          <button className={styles.action_button}>
            {pathname === "/" ? "Start Game" : "Start Again"}
          </button>
        </form>
      </section>
      <section className={styles.right_dot_grid}></section>
    </div>
  );
}

export default MainLayout;
