import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  About,
  Profile,
  Home,
  SignIn,
  SignUp,
  CreateListing,
  UpdateListing,
  Listing,
  Search,
} from "./pages/index";
import Header from "./components/Header";
import Private from "./components/Private";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route element={<Private />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listing" element={<Search />} />
      </Routes>
    </Router>
  );
};

export default App;
