import Board from "./containers/Board";

export default function Home() {
  return (
    <div className="game-page">
      <main className="game-panel">
        <h1 className="game-title">
          Tic <em>Tac</em> Toe
        </h1>
        <Board />
      </main>
    </div>
  );
}
