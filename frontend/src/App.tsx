import { GameCanvas } from "./components/GameCanvas";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GameCanvas />
    </div>
  );
}

export default App;
