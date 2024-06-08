import { useContext, useEffect, useState } from 'react';
import './App.css';
import { AuthenticationContext, CoreContext, ItemsPanelContext, ModalsContext, NavigationContext } from './fragments/Contexts';
import SmallNavigation from './components/navigation/SmallNavigation';
import Router from './Router';
import Login from './components/navigation/auth/Login';
import Registration from './components/navigation/auth/Registration';
import ForgotPassword from './components/navigation/auth/ForgotPassword';
import { useTranslation } from 'react-i18next';
import LargeNavigation from './components/navigation/LargeNavigation';
import { getDeliveriesBagActions, getFavoritesActions } from './core/storage';
import Settings from './components/navigation/settings/Settings';
import { translateDayOfWeek } from './core/languages';
import { Link } from 'react-router-dom';

function App() {
  const navigationContext = useContext(NavigationContext);
  const [navigation, setNavigation] = useState(
    {
      ...navigationContext,
      update(data) { setNavigation(data) }
    }
  );

  const { t } = useTranslation();

  const modalsContext = useContext(ModalsContext);

  const [modalsOpened, setModalsOpened] = useState(
    {
      ...modalsContext,
      update(data) { setModalsOpened(data) }
    }
  );

  const authenticationContext = useContext(AuthenticationContext);
  const [authentication, setAuthentication] = useState(
    {
      ...authenticationContext,
      update(data) {
        setAuthentication(data)
      }
    }
  );

  const coreContext = useContext(CoreContext);
  const [core, setCore] = useState({
    ...coreContext,
    updateState(data) {
      setCore(data)
    }
  });

  const [itemsPanelContext, setItemsPanelContext] = useState({
    updateFavorites() {
      this.favorites = getFavoritesActions().get();
      setItemsPanelContext({ ...this });
    },
    updateDeliveriesBag() {
      this.deliveriesBag = getDeliveriesBagActions().get();
      setItemsPanelContext({ ...this });
    }
  });

  useEffect(() => {
    authentication.checkAuth();
  }, []);


  useEffect(() => {
    core.update();
    itemsPanelContext.updateFavorites();
    itemsPanelContext.updateDeliveriesBag();
  }, [t])

  function navigations() {
    switch (navigation.variant) {
      case 'small':
        return <SmallNavigation controlPanel={false} />;
      case 'controlPanel':
        return <SmallNavigation controlPanel={true} />;
      case 'large': return <LargeNavigation background={navigation.backgroundPath} />;
      default:
        return <Router />;

    }
  }

  return (
    <>
      <NavigationContext.Provider value={navigation}>
        <AuthenticationContext.Provider value={authentication}>
          <ModalsContext.Provider value={modalsOpened}>
            <CoreContext.Provider value={core}>
              <ItemsPanelContext.Provider value={itemsPanelContext}>
                {navigations()}
                <footer>
                  <div className='first-part'>
                    <div className='our-location'>
                      <span className='header'>{t('location')}</span>
                      <div className='wrapper'>
                        <img alt="not found" src='/images/city.png' />
                        <span>{core.city}</span>
                      </div>
                      <div className='wrapper'>
                        <img alt="not found" src='/images/house.png' />
                        <span>{core.street}</span>
                      </div>
                    </div>

                    <div className='contact-us'>
                      <span className='header'>{t('contactUs')}</span>
                      <div className='wrapper'>
                        <img alt="not found" src='/images/phone.png' />
                        <span>{core.phone}</span>
                      </div>

                      <div className='wrapper'>
                        <img alt="not found" src='/images/email.png' />
                        <span>{core.email}</span>
                      </div>
                    </div>

                    <div className='working-time'>
                      <span className='header'>{t('workingTime')}</span>
                      <div className='wrapper'>
                        <img alt="not found" src='/images/calendar.png' />
                        <span>{t('fromWord')} {translateDayOfWeek(core.openDay)} {t('toWord')} {translateDayOfWeek(core.closeDay)}</span>
                      </div>
                      <div className='wrapper'>
                        <img alt="not found" src='/images/clock.png' />
                        <span>{t('fromWord')}  {core.openTime}{t('hourDefinition')} {t('toWord')} {core.closeTime}{t('hourDefinition')}</span>
                      </div>
                    </div>
                    {core.instagramLink !== '' || core.twitterLink !== '' || core.facebookLink !== '' ? (<>
                      <div className='follow-us'>
                        <span className='header'>{t('followUsFooter')}</span>
                        <div className='row-wrapper'>
                          {core.facebookLink !== '' ? (<>
                            <Link to={core.facebookLink}>
                              <img alt="not found" src='/images/facebook.png' />
                            </Link>
                          </>) : null}
                          {core.instagramLink !== '' ? (<>
                            <Link to={core.instagramLink}>
                              <img alt="not found" src='/images/instagram.png' />
                            </Link>
                          </>) : null}
                          {core.twitterLink !== '' ? (<>
                            <Link to={core.twitterLink}>
                            <img alt="not found" src='/images/twitter.png' />
                            </Link>
                          </>) : null}
                        </div>
                      </div>
                    </>) : null}
                  </div>

                  <div className='second-part'><span>{core.firm} © All rights reserved!</span></div>
                </footer>

                {modalsOpened.login ?
                  <Login />
                  : null
                }

                {modalsOpened.registration ?
                  <Registration />
                  : null}

                {modalsOpened.forgotPassword ?
                  <ForgotPassword />
                  : null}

                {modalsOpened.settings ?
                  <Settings />
                  : null}
              </ItemsPanelContext.Provider>
            </CoreContext.Provider>
          </ModalsContext.Provider>
        </AuthenticationContext.Provider>
      </NavigationContext.Provider>
    </>
  );
}

export default App;
