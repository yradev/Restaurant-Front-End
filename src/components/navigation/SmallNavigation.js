import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AuthenticationContext, ModalsContext } from "../../fragments/Contexts";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import Flag from "react-world-flags";
import getLanguages from "../../core/languages";
import { getLanguage } from "../../core/storage";
import i18next from "i18next";
import Router from "../../Router";
import Favorites from "./favorites/Favorites";
import DeliveriesBag from "./deliveriesBag/DeliveriesBag";

export default function SmallNavigation({ controlPanel }) {
    const { t } = useTranslation();
    const authentication = useContext(AuthenticationContext);
    const modalsOpened = useContext(ModalsContext);
    const [language, setLanguage] = useState(getLanguages().find(a => a.code === getLanguage()));
    const [languageDropdown, setLanguageDropdown] = useState(false);
    const [closingDropdown, setClosingDropdown] = useState(false);
    const [favoritesDropdown, setFavoritesDropdown] = useState(false);
    const [deliveriesBagDropdown, setDeliveriesBagDropdown] = useState(false);

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
    }, [closingDropdown])

    return <>
        <header className="small-navigation-wrapper">
            <nav className="row-wrapper">
                <div className="left row-wrapper">
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

                    <nav-items>
                        <Link to='/'>{t('homeNavigation')}</Link>
                        <Link to='/menu'>{t('menuNavigation')}</Link>
                        <Link to='/reservation'>{t('reservationNavigation')}</Link>
                    </nav-items>
                </div>
                <div className="right nav-text row-wrapper">
                    {!authentication.isLogged ? (
                        <button
                            type='button'
                            className="btn-transperant btn-custom nav-text"
                            onClick={() => modalsOpened.updateLogin(true)}
                        >
                            {t('loginNavigation')}
                        </button>
                    ) : (
                        <>
                            <div className="profile row-wrapper">
                                <img src='/images/profile.png'
                                    alt="Not Found"
                                />
                                <span>{authentication.email}</span>
                            </div>
                            <button
                                type="button"
                                className="btn-transperant"
                                onClick={() => modalsOpened.updateSettings(true)}>
                                <OverlayTrigger
                                    placement='bottom'
                                    overlay={
                                        <Tooltip>
                                            {t('settingsTooltip')}
                                        </Tooltip>
                                    }>
                                    <img
                                        alt="Not Found"
                                        src="/images/settings.png" />
                                </OverlayTrigger>
                            </button>
                            {authentication.roles.includes('STAFF') || authentication.roles.includes('OWNER') ? (
                                <Link
                                    className="nav-text"
                                    style={{ fontSize: 'small' }}
                                    to='/cp'
                                >
                                    cPanel
                                </Link>
                            ) : null}
                            <button className="btn-transperant" onClick={() => authentication.logout()}>
                                <img
                                    alt="Not Found"
                                    src="/images/logout.png" />
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div className="sub-nav row-wrapper">
                <div className="nav-text items-panel row-wrapper">
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

                        <Dropdown.Menu className="dropdown-wrapper" >
                            {favoritesDropdown && <Favorites />}
                        </Dropdown.Menu>
                    </Dropdown>
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

                            <img alt="not found" src="/images/delivery-bag.png" width={15} />
                            <span>{t('deliveryBagNavigation')}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-wrapper">
                            <DeliveriesBag setDeliveriesBagDropdown={setDeliveriesBagDropdown} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {controlPanel ? (<>
                    <nav className="nav-text control-panel">
                        <nav-items>
                            <Link to='/cp/details'>{t('detailsNavigation')}</Link>
                            <Link to='/cp/user'>{t('userControlNavigation')}</Link>
                            <Link to='/cp/menu'>{t('menuControlNavigation')}</Link>
                        </nav-items>
                    </nav>
                </>) : null}
            </div>
        </header>
        <main>
            <Router />
        </main>
    </>
}