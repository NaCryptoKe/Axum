import '../css/subnav.css';
import searchIcon from '../assets/search.svg';

export default function SubNav() {
  return (
    <nav className="subnav">
      <div className="subnav-left">
        <ul className="subnav-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">Browse</a></li>
          <li><a href="#">Discover</a></li>
          <li><a href="#">News</a></li>
        </ul>

        <form className="search-form" action="">
          <input 
            type="text" 
            placeholder="Search games..." 
            className="search-input" 
          />
          <button className="search-btn" type="button">
            <img src={searchIcon} alt="Search" className="search-icon" />
          </button>
        </form>
      </div>

      <a className="settings-link" href="#">Settings</a>
    </nav>
  );
}
