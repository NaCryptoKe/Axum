import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <section>
                {/* Brand */}
                <div>
                    <h2>AXUM ARCADE</h2>
                    <p>
                        The ultimate destination for independent games and community-driven play.
                    </p>
                </div>

                {/* Platform Links */}
                <div>
                    <h4>Platform</h4>
                    <ul>
                        <li><Link to="/games">Browse Games</Link></li>
                        <li><Link to="/community">Community</Link></li>
                        <li><Link to="/publishing">Publish Your Game</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4>Stay Updated</h4>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Email address" />
                        <button type="submit">Join</button>
                    </form>
                </div>
            </section>

            <hr />

            <div>
                <p>&copy; {currentYear} Axum Arcade. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;