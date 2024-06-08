import { useContext, useEffect, useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

import { Link } from "react-router-dom";
import Flag from "react-world-flags";
import { getLanguage } from "../../core/storage";
import getLanguages from "../../core/languages";
import i18next from "i18next";
import DeliveriesBag from "./deliveriesBag/DeliveriesBag";
import Favorites from "./favorites/Favorites";
import { AuthenticationContext, ModalsContext } from "../../fragments/Contexts";
import { useTranslation } from "react-i18next";
import Router from "../../Router";

export default function LargeNavigation({ background }) {
    const [languageDropdown, setLanguageDropdown] = useState(false);
    const [favoritesDropdown, setFavoritesDropdown] = useState(false);
    const [deliveriesBagDropdown, setDeliveriesBagDropdown] = useState(false);
    const [language, setLanguage] = useState(getLanguages().find(a => a.code === getLanguage()));
    const [closingDropdown, setClosingDropdown] = useState(false);
    const modalsOpened = useContext(ModalsContext);
    const authentication = useContext(AuthenticationContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (closingDropdown) {
            const timer = setTimeout(() => {
                if (languageDropdown) {
                    setLanguageDropdown(false);
                }
                if (favoritesDropdown) {
                    setFavoritesDropdown(false);
                }
                if (deliveriesBagDropdown) {
                    setDeliveriesBagDropdown(false);
                }
            }, 200);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [closingDropdown]);


    return <header>
        <div className="large-navigation-wrapper column-wrapper" style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${background})`
        }}>
            <nav className="row-wrapper">
                <div className="left row-wrapper">
                    <Link to='/'>
                        <img alt="not found" className="logo" src="/images/logo.png" />
                    </Link>
                    <Dropdown
                        show={languageDropdown}
                        onMouseEnter={() => {
                            setLanguageDropdown(true);
                            setClosingDropdown(false)
                        }}
                        onMouseLeave={() => {
                            setClosingDropdown(true);
                        }}
                        className="transperant-dropdown"
                    >
                        <Dropdown.Toggle
                            variant="transperant"
                            className="nav-text row-wrapper"
                        >
                            <Flag code={language.flagCode} />
                            <span>{language.name}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-wrapper languages-wrapper">
                            {getLanguages().map((value, index) => {
                                if (value.name !== language.name) {
                                    return <div key={index}>
                                        <button className="btn-transperant btn-custom" onClick={() => {
                                            i18next.changeLanguage((value.code))
                                            setLanguage(value)
                                        }}>
                                            <Flag code={value.flagCode} /> {value.name}
                                        </button >
                                    </div>
                                } else {
                                    return null;
                                }
                            })}
                        </Dropdown.Menu>
                    </Dropdown>

                </div>
                <div className="center nav-text row-wrapper">
                    <Link to='/'>{t('homeNavigation')}</Link>
                    <Link to='/menu'>{t('menuNavigation')}</Link>
                    <Link to='/reservation'>{t('reservationNavigation')}</Link>
                </div>
                <div className="right row-wrapper nav-text">
                    <Dropdown
                        show={favoritesDropdown}
                        onMouseEnter={() => {
                            setClosingDropdown(false)
                            if (deliveriesBagDropdown) {
                                setDeliveriesBagDropdown(false);
                            }
                            setFavoritesDropdown(true);
                        }}
                        onMouseLeave={() => {
                            setClosingDropdown(true);
                        }}
                    >
                        <Dropdown.Toggle
                            variant="transperant"
                            className="nav-text row-wrapper"
                        >
                            <img src="/images/favorites.png" alt="not found" width={15} />
                            <span>{t('favoritesNavigation')}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-wrapper">
                            {favoritesDropdown && <Favorites />}
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="deliveries">
                        <Dropdown
                            show={deliveriesBagDropdown}
                            onMouseEnter={() => {
                                setClosingDropdown(false)
                                if (favoritesDropdown) {
                                    setFavoritesDropdown(false);
                                }
                                setDeliveriesBagDropdown(true);

                            }}
                            onMouseLeave={() => {
                                setClosingDropdown(true);
                            }}
                            className="transperant-dropdown"
                        >
                            <Dropdown.Toggle
                                variant="transperant"
                                className="nav-text row-wrapper"
                            >

                                <img alt="not found" src="/images/delivery-bag.png" />
                                <span>{t('deliveryBagNavigation')}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-wrapper">
                                <DeliveriesBag />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    {!authentication.isLogged ?
                        <button
                            type='button'
                            className="btn-transperant"
                            onClick={() => modalsOpened.updateLogin(true)}>
                            {t('loginNavigation')}
                        </button>
                        : <>
                            <OverlayTrigger
                                placement='bottom'
                                overlay={
                                    <Tooltip>
                                        {t('settingsTooltip')}
                                    </Tooltip>
                                }>

                                <button
                                    type="button"
                                    className="btn-transperant"
                                    onClick={() => modalsOpened.updateSettings(true)}>
                                    <img
                                        alt="not found"
                                        src="/images/settings.png" />
                                </button>
                            </OverlayTrigger>

                            {authentication.roles.includes('STAFF') || authentication.roles.includes('OWNER') ?
                                <Link
                                    className="nav-text"
                                    style={{ fontSize: 'small' }}
                                    to='/cp'
                                >
                                    cPanel
                                </Link> : null}

                            <button className="btn-transperant" onClick={() => authentication.logout()}>
                                <img alt="not found"
                                    src="/images/logout.png" />
                            </button>
                        </>
                    }
                </div>
            </nav>
            <div className="main column-wrapper">
                <Router />
            </div>
        </div>
    </header>
}