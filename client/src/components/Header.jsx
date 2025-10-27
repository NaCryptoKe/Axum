import '../css/header.css';
import message from '../assets/message-circle.svg';
import bell from '../assets/bell.svg';
import bookmark from '../assets/bookmark.svg';
import game from '../assets/gamepad-2.svg';
import download from '../assets/cloud-download.svg';
import library from '../assets/library.svg';
import cart from '../assets/shopping-cart.svg';
import user from '../assets/ghost-of-yotei-game-5762x2880-19048.jpg';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-left">
        <h2 className="brand">AXUM</h2>

        <nav className="nav-main">
          <ul>
            <li>
              <a href="#">
                <div className="selected">
                  <img src={game} alt="game" className="icon" />
                  Games
                </div>
              </a>
            </li>

            <li>
              <a href="#">
                <div className="nav-item">
                  <img src={bookmark} alt="wishlist" className="icon" />
                  Wish List
                </div>
              </a>
            </li>

            <li>
              <a href="#">
                <div className="nav-item">
                  <img src={library} alt="library" className="icon" />
                  Library
                </div>
              </a>
            </li>

            <li>
              <a href="#">
                <div className="nav-item">
                  <img src={download} alt="downloads" className="icon" />
                  Downloads
                </div>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <nav className="nav-side">
        <ul>
          <li>
            <a href="#">
              <img src={cart} alt="cart" className="icon-btn" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={bell} alt="notifications" className="icon-btn" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={message} alt="messages" className="icon-btn" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={ user } className="profile icon-btn" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
