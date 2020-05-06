import React, { useState } from "react";
import Particles from "react-particles-js";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

import "./App.css";

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

function App() {
  const [input, setInput] = useState("https://i.imgur.com/rhExq0w.jpg");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("home");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});

  const setInitialState = () => {
    setInput("https://i.imgur.com/rhExq0w.jpg");
    setImageUrl("");
    setBox({});
    setRoute("home");
    setIsSignedIn(false);
    setUser({});
  };

  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onPictureSubmit = () => {
    setBox({});
    setImageUrl(input);
    fetch("https://cryptic-shore-30860.herokuapp.com/imageUrl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          if (isSignedIn) {
            fetch("https://cryptic-shore-30860.herokuapp.com/image", {
              method: "put",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: user.id,
              }),
            })
              .then((res) => res.json())
              .then((count) => {
                setUser({ ...user, entries: count });
              })
              .catch(console.log);
          }
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((error) => console.log(error));
  };

  const onRouteChange = (route) => {
    if (route === "signout") setInitialState();
    if (route === "home") setImageUrl("");
    setRoute(route);
  };

  const loadUser = (user) => {
    setUser(user);
    setIsSignedIn(true);
    setInput("https://i.imgur.com/rhExq0w.jpg");
    setImageUrl("");
    setBox({});
    setRoute("home");
  };

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <>
          {" "}
          <span className="pointer" onClick={() => onRouteChange("home")}>
            <Logo />
          </span>
          <Rank
            isSignedIn={isSignedIn}
            name={user.name}
            entries={user.entries}
          />
          <ImageLinkForm
            input={input}
            onInputChange={onInputChange}
            onPictureSubmit={onPictureSubmit}
          />
          <FaceRecognition imageUrl={imageUrl} box={box} />
        </>
      ) : route === "signin" ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
}

export default App;
