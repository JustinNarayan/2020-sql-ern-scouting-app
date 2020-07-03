import React from "react";
import model from "./models/model";
import { StoreProvider, createStore } from "easy-peasy";
import { BrowserRouter } from "react-router-dom";
import Routing from "./components/Routing";
import "./assets/style.css";

const store = createStore(model);

function App() {
   return (
      <BrowserRouter>
         <StoreProvider store={store}>
            <Routing />
         </StoreProvider>
      </BrowserRouter>
   );
}

export default App;
