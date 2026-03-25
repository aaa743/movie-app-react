import {useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
} from 'react-router-dom'
import './App.css'

const API_KEY = 'YOUR_TMDB_API_KEY'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

// --- Navbar Component ---
const Navbar = ({onSearch}) => {
  const [searchInput, setSearchInput] = useState('')
  const history = useHistory()

  const handleSearch = e => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput)
      history.push('/search')
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Test Case: Heading with text content as "movieDB" */}
        <Link to="/" className="logo-link" style={{textDecoration: 'none'}}>
          <h1>movieDB</h1>
        </Link>
        <div className="nav-links">
          <Link to="/">Popular</Link>
          <Link to="/top-rated">Top Rated</Link>
          <Link to="/upcoming">Upcoming</Link>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          {/* Test Case: HTML search input element */}
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
          {/* Test Case: HTML button element with text content as "Search" */}
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </nav>
  )
}

// --- Movie Card Component ---
const MovieCard = ({movie}) => (
  <div className="movie-card">
    <img
      src={
        movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image'
      }
      alt={movie.title}
    />
    <div className="card-info">
      <h3>{movie.title}</h3>
      <p>Rating: {movie.vote_average}</p>
      <Link to={`/movie/${movie.id}`}>
        {/* Test Case: HTML button element with text content as "View Details" */}
        <button className="view-details-btn" type="button">
          View Details
        </button>
      </Link>
    </div>
  </div>
)

// --- Movie Grid Component ---
const MovieGrid = ({title, apiEndpoint}) => {
  const [movies, setMovies] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(apiEndpoint)
        if (response.ok) {
          const data = await response.json()
          setMovies(data.results || [])
          setIsSuccess(true)
        }
      } catch (error) {
        console.error('Fetch Error:', error)
      }
    }
    fetchMovies()
  }, [apiEndpoint])

  return (
    <div className="page-wrapper">
      {/* Test Case: Heading "Popular" (or others) visible after success */}
      {isSuccess && <h1 className="section-title">{title}</h1>}
      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

// --- Single Movie Details Page ---
const MovieDetailsPage = () => {
  const {id} = useParams()
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
        )
        const data = await res.json()
        setDetails(data)
      } catch (e) {
        console.error(e)
      }
    }
    getDetails()
  }, [id])

  if (!details) return <div className="loading">Loading...</div>

  return (
    <div className="details-container">
      <h1>{details.title}</h1>
      <img
        src={`${IMAGE_BASE_URL}${details.poster_path}`}
        alt={details.title}
      />
      <p>{details.overview}</p>
    </div>
  )
}

// --- Main App Component ---
function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Router>
      <div className="App">
        <Navbar onSearch={q => setSearchQuery(q)} />
        <Switch>
          <Route exact path="/">
            <MovieGrid
              title="Popular"
              apiEndpoint={`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`}
            />
          </Route>
          <Route path="/top-rated">
            <MovieGrid
              title="Top Rated"
              apiEndpoint={`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`}
            />
          </Route>
          <Route path="/upcoming">
            <MovieGrid
              title="Upcoming"
              apiEndpoint={`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`}
            />
          </Route>
          <Route path="/search">
            <MovieGrid
              title="Search Results"
              apiEndpoint={`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchQuery}`}
            />
          </Route>
          <Route path="/movie/:id" component={MovieDetailsPage} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
