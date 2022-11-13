import { useGlobalState } from "../src/context/main";
import MainLayout from "../src/Layouts/Main";

function GameEnd() {
  const { previous_game_stats } = useGlobalState();
  const { eaten_food, total_food, elapsed_seconds } = previous_game_stats;
  return (
    <MainLayout>
      <h1 className="font-size-3-rem text-danger mb-4">Game Over</h1>
      <p className="text-primary">
        Total Food:{" "}
        <span className="bold">
          {eaten_food}/{total_food}
        </span>
      </p>
      <p className="text-primary">
        Time Spent: <span className="bold"> {elapsed_seconds} seconds</span>
      </p>
    </MainLayout>
  );
}

export default GameEnd;
