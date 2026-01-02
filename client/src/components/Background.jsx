import React from 'react';

const Background = React.forwardRef(({ coverImg, videoSrc, isVideoActive }, ref) => {
    return (
    <>
        <img src={coverImg} alt="Cover Art" className='background-img'/>
        <video ref={ref} className="background-video" loop playsInline muted>
        <source src={videoSrc} type="video/mp4" />
        </video>
    </>
    );
});

export default Background;