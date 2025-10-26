import Card from './Game Card'
import '../css/content.css'

export default function ContentSection () {
    return (
        <>
            <div className='content'>
                <h1>CONTINUE PLAYING</h1>
                <div className="card-layout">
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
            </div>
        </>
    );
}