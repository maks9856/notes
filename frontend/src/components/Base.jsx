import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import '../styles/Base.css';
export default function Base() {
  return (
    <div className="container">
      
        <nav className="sidebar-container">
          <div className="notes-sidebar-swicher">
            <div className="user-notes-sidebar-swicher">sjkmfskjmfs</div>
            
          </div>
          <ul>
            <li>Search</li>
            <li><Link to={'/notes'}/>Home</li>
          </ul>
          <h1>Private</h1>
          <ul>
            <li>

            </li>
          </ul>
          <h1>Public</h1>
          <ul>
            <li>

            </li>
          </ul>
          <ul>
            <li>
              Settings
            </li>
            <li>Trash</li>
          </ul>
        </nav>
      <div className="div-content">
        <header className="header-notes-container"></header>
        <main className="main-notes-container">
             <Outlet />
        </main>
         
      </div>
    </div>
  );
}
