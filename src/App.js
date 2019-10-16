import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "39d724ef70ae41269091815b2c038508",
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    size: {
      enable: true,
      value: 2,
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: [],
      route: "signout",
      // after creating the face recognition box, we want to make the sign in page and register page separate from the home page
      // *** when the app first starts, the constructor sets the state initially, so because 'this.state.route' is initially set to 'signout', the FIRST ternary operator in the render() method returns false and it returns the second expression which is another ternary operator which returns true because this.state.route === 'signout' and returns the 'Signin.js' page
      isSignedIn: false,
      // we created this state in order to let the program know when to display the navbar with 'Sign Out' (home page) and when to display just the logo (sign in and register page). When the app starts, the initial state is set to the boolean value 'false' because to display the navbar WITHOUT the 'Sign Out' since the starting page is going to be the 'Signin.js' page (see above)
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  loadUser = data => {
    // console.log(data);
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = data => {
    let boxArray = []; // instead of creating a new array (because in order to use the map method, we need to have an array), we can simply set this.state.box: [] (an array) like above, however, if we decided to set this.state.box: {} (an object), then we'd have to create a new array to push it in in other to use the array loop methods (if we tried to use the push method (like below), when this.state.box: {} (is an object) it wouldn't work because we need it to be an array to use the push method.)
    // UPDATE: we actually need to create an empty array WITHIN the 'calculateFaceLocation function (see the 'MAJOR FLAW RIGHT NOW' comment below (if we use 'this.state.box' (where box: []) instead of creating 'boxArray')), the reason why we need to create an empty array is because if we use 'this.state.box' as the array in which we are pushing the values of the box in, then we're going to get the flaw that we were talking about (array containing both old and new values and generating old and new boxes on the URL image).
    // NOTE from Nabil about 'constructor in React':
    // constructor sets the state initially once the app starts ***and it DOESN'T get reset***, constructor fires off once and that's it, so it SAVES all values while your app is still running hence why we encountered that major flaw when we used 'this.state.box' as the containing array, it SAVES the values and generates us all the boxes that it saved.
    // therefore we should never update the state directly with this.state BECAUSE React needs to figure out when to re-render (and it can only do that if we use their 'setState' call) ?then it compares the DOM with the virtual DOM? (what does this mean)

    const clarifaiFace = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);

    // the for of loop syntax is: for (variable of iterable) { statement } **iterables are arrays and strings (able to iterate over INDIVIDUAL items) so in this case 'data.outputs[0].data.regions' is an array
    for (const face of clarifaiFace) {
      boxArray.push({
        bottomRow: height - face.region_info.bounding_box.bottom_row * height,
        leftCol: face.region_info.bounding_box.left_col * width,
        rightCol: width - face.region_info.bounding_box.right_col * width,
        topRow: face.region_info.bounding_box.top_row * height,
      });
      // here what we're doing is we are looping over each 'face' (items of the array) from the array 'const clarifaiFace' that it detects and pushes the value of the box (columns and rows) into the 'boxArray' array so that later on in 'FaceRecognition.js' we can map over the array and have it generate the box (CSS lines).

      // *** THE MAJOR FLAW RIGHT NOW: every time we click detect, it keeps pushing the values of the box into the this.state.box array, and it 'remembers' those values because it's in the same array that we later on, in 'FaceRecognition', map over to generate the box lines and so when we change URL (image), yes it will generate new boxes for the faces of the new picture, BUT it will also show the old boxes of the old faces of the old picture because the old values of the old boxes are still in the this.state.box array.
      // so how do we make sure that every time we click detect, it's a fresh empty array that we're pushing the values in and mapping over to generate the face boxes?
    }

    return boxArray;
    // after we looped and pushed the values of the box into the array 'boxArray' (i.e. [0] (index 0) has bottomRow: 100, leftCol: 50, rightCol: 150, topRow: 200, then [1] ... for as many 'faces' as it detects) we want to return it
  };

  displayFaceBox = boxValue => {
    // console.log(boxValue);
    this.setState({ box: boxValue }); // we wrap box: boxValue in curly brackets because it's an objet (key: value)
  };

  onInputChange = event => {
    // we receive an argument here so we need a parameter to accept the argument, in this case we have an 'onChange' event listener where it listens to when the <input> tag (in 'ImageLinkForm.js') is changed, run the 'onInputChange' function which is to change the state of input: event.target.value (where event.target.value is whatever the input value is).
    // When we copy and paste a URL link in the input box, it will trigger the 'onChange' event listener and pass the URL (argument) to the event (parameter).
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    // we don't receive any argument here so there's no need for a parameter. we don't receive any argument because the 'onClick' event listener in this case just listens for whenever the user clicks on the 'Detect' button (in 'ImageLinkForm.js') and it will let the program know that the user has clicked on it, so execute the 'onPictureSubmit' function
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.DEMOGRAPHICS_MODEL, this.state.input) // *** see comment at the end as to why we can't use this.state.imageURL instead
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
              // Object.assign gets the target object (this.state.user) and the second parameter is where you want to extend it with
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
    // .then(                         // check the breakdown of the nested object
    //   function(response) {
    //     console.log(response);
    //   }
    // )
    // console.log('characteristics', response.outputs[0].data.regions[0].data.face);
    // console.log('face box', response.outputs[0].data.regions[0].region_info.bounding_box);
  };

  onRouteChange = routeValue => {
    // *** we linked 'onRouteChange' to the 'onClick' event listener so that whenever we click on an element (sign in, sign out or register), it would return us the 'route' value associated with it to then use the 'route' values direct the users to the right page.
    this.setState({ route: routeValue }); // we need our 'this.state.route' value to change dynamically instead of us setting it statically because if we click on 'Sign in' we want it to bring us into the home page (App) meaning that 'this.state.route' === something other than 'signin' (because if it === 'signin' then in the ternary operator, it returns true and returns the first expression which is the 'Signin' page) so therefore in the 'Signin.js' we have to tell the onClick event that when a user clicks on the sign in button, we change the routeValue (parameter in onRouteChange in which it receives the value) to 'home' so that 'this.state.route' === 'home' which returns false and returns us the home page (App)

    if (routeValue === "signout") {
      this.setState({ isSignedIn: false });
    } else if (routeValue === "home") {
      this.setState({ isSignedIn: true });
    }
    // we created an 'if else' statement here to tell our program that if the 'route' value that we receive from the event listener is 'signout', then setState (re-render) and assign the boolean value 'false' to isSignedIn (and because isSignedIn is now false, in 'Navigation.js' it's going to return us the navbar without 'Sign Out' because if we think about it, if we're not signed in (hence isSignedIn: False), then we can't sign out).
    // else if the 'route' value is 'home', then isSignedIn: true and it returns us the navbar with 'Sign Out'
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />

        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {/* Not only are we changing the 'this.state.route' value from the onRouteChange function from the 'Signin' component, but from the 'Navigation' component as well when we want to sign out of the home page back to the sign in page, so we need to change the 'route' value back to 'signout' with the 'onClick' event of the 'Sign Out' <p> tag in 'Navigation.js' */}
        {/* Additionally, we have the prop 'isSignedIn' where we pass the 'this.state.isSignedIn' value to 'Navigation.js' */}
        {this.state.route === "home" ? ( // ternary operator if route === 'home' is true, then it would return us the home page, if false so if route === something other than 'home' then it would run the second expression which is ANOTHER ternary operator.
          <div>
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signout" ? (
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

// all the yellow tags are 'components/child' of the parent 'App' and the purple tags (besides className) are 'props (data (i.e. box={this.state.box}), functions (i.e. onRouteChange={this.onRouteChange}))' that are passed down to child components
// DATA example 'FaceRecognition' component has a 'box' prop which is {this.state.box}, in this case, the values that are passed are the values of the box (columns and rows) generated from the loop in calculateFaceLocation
// so if we check the 'FaceRecognition' component (see comment at the end of the component)
// FUNCTION example 'Navigation' component has a 'onRouteChange' prop which is {this.onRouteChange} and executes the function 'onRouteChange' when the event listener 'onClick' is triggered.

export default App;

// (1) since onInputChange is a part of the 'App' class, to access it, we need to do 'this.onInputChange' because onInputChange is a property of the 'App'

// *** Calling setState() in React is asynchronous, for various reasons (mainly performance). Under the covers React will batch multiple calls to setState() into a single call, and then re-render the component a single time, rather than re-rendering for every state change. Therefore the imageUrl parameter would have never worked in our example, because when we called Clarifai with our the predict function, React wasn't finished updating the state.
// One way to go around this issue is to use a callback function:
// setState(updater, callback)
