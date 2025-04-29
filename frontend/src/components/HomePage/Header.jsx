import logoGrayscale from '../../assets/logo-grayscale.svg';
import '../../styles/HomePage/Header.css';
import { useNavigate } from 'react-router-dom';
export default function Header() {
    const navigate = useNavigate();
    function hangleLogin(){
        navigate('/login');
    }

    return (
        <header>
            <nav className="header__nav">
                <div className="header__brand">
                    <img src={logoGrayscale} alt="Logo" className="header__logo" />
                    <p className="header__title">Notes</p>
                </div>
                <ul className="header__nav__list">
                    <li className="header__nav__list__item">
                        <button className='button__login' onClick={hangleLogin}>Log in</button>
                    </li>
                    <li className="header__nav__list__item">
                        <button className='button_get_notes' onClick={hangleLogin}>Get Notes free</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
