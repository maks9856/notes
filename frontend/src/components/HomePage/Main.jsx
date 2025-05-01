import '../../styles/HomePage/Main.css';
import hero_img from '../../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';
export default function Main() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/register');
    }
    return (
        <main>
            <div className='main__homepage'>
            <section className="main__hero">
                <div className="hero__content">
                    <h1 className="hero__title">The happier workspace</h1>
                    <h2 className="hero__subtitle">Write. Plan. Collaborate. With a little help from AI.</h2>
                    <div className="hero__buttons">
                        <button className="hero__button" onClick={handleClick}>Sign up</button>
                    </div>
                    <div className="hero__logoGrouop">
                       <span className="hero__trusted-by">Trusted by teams at</span>
                       <section className='hero_logoWall'>
                        <div className='logoWall__container'>
                          
                        </div>
                       </section>
                    </div>
                </div>
                <div className='img__content'>
                    <img className='img__hero' src={hero_img} alt="" />
                </div>
            </section>
            </div>
           
        </main>
    );
}
