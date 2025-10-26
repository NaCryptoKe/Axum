import yotei from '../assets/ghost-of-yotei-game-5762x2880-19048.jpg'
import '../css/card.css'

export default function GameCard() {
    return (
        <div className='game-card'>
            <img src={yotei} alt="Ghost of Yotei" className="game-img" />

            <div className="card-info">
                <h3>Ghost Of Yotei</h3>
                <div className="info-details">
                    <p><strong>Last Played:</strong> 3 Hours Ago</p>
                    <div>
                        <p><strong>Progress:</strong></p> 
                        <p>Chapter 4 - The Whispering Peaks</p>
                    </div>
                </div>
                <div className="progress-bar">
                    <div className="progress-filled"></div>
                </div>
                <button className='resume-btn'>CONTINUE PLAYING</button>
            </div>
        </div>
    );
}
