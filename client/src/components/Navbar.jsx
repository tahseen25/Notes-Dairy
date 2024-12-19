import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from '../assets/images/logo.svg';
import { useAuth } from "../store/auth";

export const Navbar = () => {
  const {isLoggedIn} = useAuth();
  return (
          
  <header className="navbar">
    <h2 className="logo">
      <NavLink to="/"><img src={logo} alt='Logo' /></NavLink>
    </h2>
    <nav className="navigation">
        <ul>
            <li>
                <NavLink to="/notes"> Notes </NavLink>
            </li>
            <li>
                <NavLink to="/dairy"> Dairy </NavLink>
            </li>
            <li>
                <NavLink to="/family"> Family </NavLink>
            </li>
            {isLoggedIn ? 
            <li>
                <NavLink to="/logout"> Logout </NavLink>
            </li>
            :
            <li>
                <NavLink to="/login"> Login </NavLink>
            </li>
            }            
            </ul>
    </nav>
  </header>
    
  );
};
