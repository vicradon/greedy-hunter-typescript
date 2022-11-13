import { useGlobalState } from "../src/context/main";
import MainLayout from "../src/Layouts/Main";

function GameWon() {
  const { previous_game_stats } = useGlobalState();
  return (
    <MainLayout>
      <h1 className="font-size-3-rem text-danger mb-4">Bravo</h1>

      <p className="text-primary">
        Time Spent:{" "}
        <span className="bold">
          {previous_game_stats.elapsed_seconds} seconds
        </span>
      </p>
    </MainLayout>
  );
}

export default GameWon;
