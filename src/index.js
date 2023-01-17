import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Footer, Header } from "./components/Component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Users } from "./components/Users";
import { UserForm } from "./components/UserForm";
import { Categories } from "./components/Categories";
import { CategoryForm } from "./components/CategoryForm";

ReactDOM.render(
  <Router>
    <Header />
    <Routes>
      <Route
        path="/"
        element={
          <h2 style={{ textAlign: "center", text: "capitalize" }}>
            Home - Shopping Cart Admin
          </h2>
        }
      />
      <Route path="/users" element={<Users />} />
      <Route path="/user/create" element={<UserForm />} />
      <Route path="/user/update/:id" element={<UserForm />} />
      <Route path="categories" element={<Categories />} />
      <Route path="/category/create" element={<CategoryForm />} />
      <Route path="/category/update/:id" element={<CategoryForm />} />
    </Routes>
    <Footer />
  </Router>,

  document.getElementById("root")
);

// serviceWorker.unregister();
