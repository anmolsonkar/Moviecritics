import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import AddMovie from "./components/AddMovie";
import AddReview from "./components/AddReview";
import Header from "./components/Header";
import "./App.css";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 300,
  easing: "ease-in-quad",
});

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/add-review" element={<AddReview />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/" element={<MovieList />} />
            <Route path="*" element={<MovieList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
