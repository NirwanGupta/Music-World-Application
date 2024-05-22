import React from 'react';
import Singersinfo from '../Artistsdata';
import "./Artistsall.css";
function ArtistsAll() {
    if (!Singersinfo || Singersinfo.length === 0) {
        return <p>No singers available at the moment.</p>;
    }

    return (
        <section className='Singerssections'>
            <header className='headofsingers'>
                <h2>Our Singers</h2> 
            </header>
            <div className='allsingers'>
                {Singersinfo.map((item) => (
                    <article  className="singer-item">
                        <div className='containerofsinger'>
                            <div className='leftimageofsinger'>
                                <img className='imageofthesinger' src={item.image} alt="" />
                            </div>
                            <div className='someinfoaboutthesinger'>
                                <div className='someinfoaboutthesinger_name'>
                                    <h6>{item.name}</h6>
                                </div>
                                <div className='likeiconofsinger'>
                                    <i class="ri-heart-fill">{item.likes}</i>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ArtistsAll;
