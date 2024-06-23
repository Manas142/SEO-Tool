import React from "react";
import {NavLink, Outlet, useLocation } from "react-router-dom";
import "./layout.css";

export const LayoutComponent = () => {
  const location = useLocation();
  console.log("location", location.pathname);
  return (
    <div className="layout-body">
      <div className="links">
        <NavLink 
        to="/"
        className={({isActive}) => (isActive ? "active" : "")} 
        >
          Home
        </NavLink>
        <NavLink
          to="/onpage"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          On Page Performance
        </NavLink>
        <NavLink
          to="/offpage"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Off Page Performance
        </NavLink>
        <NavLink
          to="/mobile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Mobile Performance
        </NavLink>
        <NavLink
          to="/desktop"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Desktop Performance
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};
