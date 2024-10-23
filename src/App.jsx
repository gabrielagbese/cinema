import { useRef, useState, useEffect } from 'react';
import './App.css';

const TMDB_API_KEY = '1048e21dba05cb3a31824d645f6ce6da';  // Replace with your TMDB API key
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;


function ComponentOne({ trailerUrl }) {
  return (
    <div className='stage-section'>
      {trailerUrl ? (
        <iframe
          width="100%"
          height="315"
          src={trailerUrl}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p>Loading trailer...</p>
      )}
    </div>
  );
}

function ComponentTwo() {
  return <div className='stage-section'>Popcorn</div>;
}

function ComponentThree() {
  return <div className='stage-section'>Nacho</div>;
}

function ComponentFour() {
  return <div className='stage-section'>Drink</div>;
}


function App() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const navigationRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch(TMDB_API_URL);
      const data = await response.json();
      const moviesWithTrailers = await Promise.all(
        data.results.slice(0, 5).map(async (movie) => {
          const trailerResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`
          );
          const trailerData = await trailerResponse.json();
          const youtubeTrailer = trailerData.results.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
          );
          return {
            ...movie,
            trailerUrl: youtubeTrailer
              ? `https://www.youtube.com/embed/${youtubeTrailer.key}`
              : null,
          };
        })
      );
      setMovies(moviesWithTrailers);
    }
    fetchMovies();
  }, []);

  const handleNextMovie = () => {
    setCurrentMovieIndex((prevIndex) =>
      prevIndex < movies.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousMovie = () => {
    setCurrentMovieIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : movies.length - 1
    );
  };


  const scrollNavigationByPercent = (percent) => {
    const scrollableElement = navigationRef.current;
    if (scrollableElement) {
      const scrollAmount = scrollableElement.clientWidth * (percent / 100);
      scrollableElement.scrollBy({ left: scrollAmount, });
    }
  };

  const scrollStageByPercent = (percent) => {
    const scrollableElement = stageRef.current;
    if (scrollableElement) {
      const scrollAmount = scrollableElement.clientWidth * (percent / 100);
      scrollableElement.scrollBy({ left: scrollAmount, });
    }
  };




  return (
    <div className='container'>
      <div className='main-container'>
        <div className='stage-container' ref={stageRef}>
          <div className='stage' >
            {movies.length > 0 && (
              <ComponentOne trailerUrl={movies[currentMovieIndex].trailerUrl} />
            )}
            <ComponentTwo />
            <ComponentThree />
            <ComponentFour />
          </div>
        </div>
        <div className='control'>
          <div className='navigation-container' ref={navigationRef}>
            <div className='navigation'>
              <p>Welcome</p>
              <button onClick={() => { scrollNavigationByPercent(100) }}>Begin</button>
            </div>
            <div className='navigation'>
              <button onClick={() => { scrollNavigationByPercent(-100) }}>Back 2</button>
              <button onClick={() => { scrollNavigationByPercent(100) }}>Next 2</button>
              <p>Select Title</p>
              {movies.length > 0 && (
                <p>{movies[currentMovieIndex].title}</p>
              )}
              <button onClick={handlePreviousMovie}>&larr;</button>
              <button onClick={handleNextMovie}>&rarr;</button>

            </div>
            <div className='navigation'>

              <button onClick={() => { scrollNavigationByPercent(-100) }}>Back 3</button>
              <button onClick={() => { scrollNavigationByPercent(100); scrollStageByPercent(100); }}>Next 3</button>
              <p>Select Seat</p>
            </div>
            <div className='navigation'>

              <button onClick={() => { scrollNavigationByPercent(-100); scrollStageByPercent(-100); }}>Back 4</button>
              <button onClick={() => { scrollNavigationByPercent(100); scrollStageByPercent(100); }}>Next 4</button>
              <p>Popcorn</p>
            </div>
            <div className='navigation'>

              <button onClick={() => { scrollNavigationByPercent(-100); scrollStageByPercent(-100); }}>Back 5</button>
              <button onClick={() => { scrollNavigationByPercent(100); scrollStageByPercent(100); }}>Next 5</button>
              <p>Nachos</p>
            </div>
            <div className='navigation'>

              <button onClick={() => { scrollNavigationByPercent(-100); scrollStageByPercent(-100); }}>Back 6</button>
              <p>Drink</p>
              <button onClick={() => { }}>Checkout</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
