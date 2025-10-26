import '../css/header.css'

export default function Header() {
    return (
        <header>
            <div className='header'>
                <h2>AXUM</h2>

                <nav className="main">
                    <ul>
                        <li><a href="#">Game</a></li>
                        <li><a href="#">Wish List</a></li>
                        <li><a href="#">Library</a></li>
                        <li><a href="#">Downloads</a></li>
                    </ul>
                </nav>
            </div>

            <nav className="side">
                <ul>
                    <li><a href="#">Cart</a></li>
                    <li><a href="#">Notification</a></li>
                    <li><a href="#">Message</a></li>
                    <li><a href="#">Profile</a></li>
                </ul>
            </nav>
        </header>
    );
}