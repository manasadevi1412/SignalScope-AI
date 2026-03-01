import { useState } from "react";
import "./styles.css";
import Coverage from "./Coverage";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">SignalX</div>
        <div className="nav-links">
          <span onClick={() => setPage("home")}>Home</span>
          <span onClick={() => setPage("coverage")}>Coverage</span>
        </div>
      </div>

      {page === "home" && (
        <div className="hero">
          <h1>SignalX</h1>
          <p>
            Visualize mobile network signal strength across cities, states, and
            countries with intelligent signal mapping.
          </p>
          <button onClick={() => setPage("coverage")}>
            Check Signal Coverage
          </button>
        </div>
      )}

      {page === "coverage" && <Coverage />}

      <div className="footer">
        SignalX © 2026 · Network Signal Visualization Platform
      </div>
    </div>
  );
}

export default App;