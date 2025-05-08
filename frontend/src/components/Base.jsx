import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import '../styles/Base.css';
export default function Base() {
  return (
    <div className="container">
      <aside className="aside-left">
        <nav>
          <ul>
            <li><Link to={'/notes'}/>Home</li>
            
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
