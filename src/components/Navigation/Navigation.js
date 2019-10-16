import React from "react";
import Tilt from "react-tilt";
import "./Navigation.css";

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="ma3 mt10">
          <Tilt
            className="Tilt br2 shadow-2"
            options={{ max: 50 }}
            style={{ height: 75, width: 75 }}
          >
            <span className="Tilt-inner pa1"></span>
          </Tilt>
        </div>
        <p
          onClick={() => onRouteChange("signout")}
          className="f4 link dim white underline pr4 pt2 pointer"
        >
          Sign Out
        </p>
      </nav>
    );
    // the reason why we added this 'if else' statement is because we only want to display the 'Sign Out' link (on the top right of the navigation bar) ONLY on the home page (App) and we added an onClick event so that when we click on 'Sign Out' it changes the route value to 'signout' which in ternary operator in 'App.js' returns us to the 'Signin.js' page
    // in order for our program to know when to display the navbar with 'Sign Out' and when to display it without, we pass it another prop 'isSignedIn' where the value can either be true or false (boolean), so if true, return the first expression, else return the second expression
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="ma3 mt10">
          <Tilt
            className="Tilt br2 shadow-2"
            options={{ max: 50 }}
            style={{ height: 75, width: 75 }}
          >
            <span className="Tilt-inner pa1"></span>
          </Tilt>
        </div>
      </nav>
    );
  }
};

export default Navigation;
