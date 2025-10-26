import '../css/nav.css'

export default function SubNav() {
    return (
        <div className='sub-nav'>
            <div className='main-sub'>
                <nav className="sub">
                    <ul>
                        <li><a href="#">HOME</a></li>
                        <li><a href="#">BROWSE</a></li>
                        <li><a href="#">DISCOVER</a></li>
                        <li><a href="#">NEWS</a></li>
                        <form action="">
                            <input className='search' type="text" name="" id="" placeholder='   Search Games'/>
                            <button className='search-button'>search</button>
                        </form>
                    </ul>
                </nav>
            </div>

            <a className='setting' href="#">Setting</a>
        </div>
    );
}