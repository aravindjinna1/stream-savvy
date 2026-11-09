import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails"; // <--- missing earlier
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import About from "./pages/About";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/about" element={<About />} /> */}

        {/* OPTIONAL: fallback route so blank pages never happen */}
        <Route path="*" element={<Home />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
