import { useContext, useEffect, useState } from "react";
import { CoreContext, NavigationContext } from "../../../fragments/Contexts";
import { useTranslation } from "react-i18next";
import { get, post, put } from "../../../core/connection";
import { Alert, Form } from "react-bootstrap";
import { translateDayOfWeek } from "../../../core/languages";

export default function CoreDetails() {
    const navigationContext = useContext(NavigationContext);
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [subname, setSubname] = useState('');
    const [phone, setPhone] = useState('');
    const [firm, setFirm] = useState('');
    const [location, setLocation] = useState('');
    const [openDay, setOpenDay] = useState('');
    const [closeDay, setCloseDay] = useState('');
    const [openTime, setOpenHour] = useState('');
    const [closeTime, setCloseHour] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [saved, setSaved] = useState(false);
    const coreContext = useContext(CoreContext);

    useEffect(() => {
        navigationContext.useControlPanelNavigation();
    }, []);

    useEffect(() => {
        (async () => {
            const core = await get('/');
            setName(core.name != null ? core.name : '');
            setSubname(core.subname != null ? core.subname : '');
            setOpenHour(core.openTime != null ? core.openTime : '');
            setCloseHour(core.closeTime != null ? core.closeTime : '');
            core.openDay !== null ? setOpenDay(core.openDay) : setOpenDay("MONDAY");
            core.closeDay !== null ? setCloseDay(core.closeDay) : setCloseDay("MONDAY");
            setFirm(core.firm !== null ? core.firm : '');
            setPhone(core.phone !== null ? core.phone : '');
            setFacebookLink(core.facebookLink !== null ? core.facebookLink : '');
            setInstagramLink(core.instagramLink !== null ? core.instagramLink : '');
            setTwitterLink(core.twitterLink !== null ? core.twitterLink : '');
            setEmail(core.email !== null ? core.email : '');
            setStreet(core.street !== null ? core.street : '');
            setCity(core.city !== null ? core.city : '');
        })();
    }, [t]);

    function onChangeHandler(event) {
        setSaved(false);

        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'description': setSubname(value); break;
            case 'contactsPhoneNumber': setPhone(value); break;
            case 'firmName': setFirm(value); break;
            case 'location': setLocation(value); break;
            case 'openDay': setOpenDay(event.target.selectedOptions[0].value); break;
            case 'closeDay': setCloseDay(event.target.selectedOptions[0].value); break;
            case 'openTime': setOpenHour(value); break;
            case 'closeTime': setCloseHour(value); break;
            case 'facebookLink': setFacebookLink(value); break;
            case 'instagramLink': setInstagramLink(value); break;
            case 'twitterLink': setTwitterLink(value); break;
            case 'email': setEmail(value); break;
            case 'street': setStreet(value); break;
            case 'city': setCity(value); break;
            default: throw new Error('Nothing here!');
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('subname', subname);
        formData.append('openTime', openTime);
        formData.append('closeTime', closeTime);
        formData.append('openDay', openDay);
        formData.append('closeDay', closeDay);
        formData.append('firm', firm);
        formData.append('phone', phone);
        formData.append('location', location);
        formData.append('facebookLink', facebookLink);
        formData.append('instagramLink', instagramLink);
        formData.append('twitterLink', twitterLink);
        formData.append('email', email);
        formData.append('street', street);
        formData.append('city', city);


        await post("/credentials/set", formData);
        setSaved(true);
        coreContext.update();
    }
    const DayOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    return (<>
        <h2 className="details-header" style={{ textAlign: 'center' }}>{t('coreDetailsHeader')}</h2>
        <Form className="core-details-wrapper fade-in" onSubmit={handleSubmit}>
            <div className="core-details field column-wrapper">
                {saved ? (<>
                    <Alert>{t('coreSettingsSaved')}</Alert>
                </>) : null}

                <div className="row-wrapper">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('restaurantNameLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="name"
                            value={name}
                            onChange={onChangeHandler}
                            placeholder={t('restaurantNamePlaceHolder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('restaurantDescriptionLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="description"
                            value={subname}
                            onChange={onChangeHandler}
                            placeholder={t('restaurantDescriptionPlaceHolder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('firmNameLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="firmName"
                            value={firm}
                            onChange={onChangeHandler}
                            placeholder={t('firmNamePlaceHolder')} />
                    </Form.Group>
                </div>
                <div className="row-wrapper">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('emailForContactsLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="email"
                            value={email}
                            onChange={onChangeHandler}
                            placeholder={t('emailForContactsPlaceHolder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('cityLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="city"
                            value={city}
                            onChange={onChangeHandler}
                            placeholder={t('cityPlaceHolder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('streetLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="street"
                            value={street}
                            onChange={onChangeHandler}
                            placeholder={t('streetPlaceHolder')} />
                    </Form.Group>
                </div>

                <div className="row-wrapper">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('phoneForContactsLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            name="contactsPhoneNumber"
                            value={phone}
                            onChange={onChangeHandler}
                            placeholder={t('phoneForContactsPlaceHolder')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('openTimeLabel')}</Form.Label>
                        <Form.Control
                            type="time"
                            name="openTime"
                            required
                            value={openTime == null ? '' : openTime}
                            onChange={onChangeHandler} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('closeTimeLabel')}</Form.Label>
                        <Form.Control
                            type="time"
                            name="closeTime"
                            required
                            value={closeTime == null ? '' : closeTime}
                            onChange={onChangeHandler} />
                    </Form.Group>
                </div>
                <div className="row-wrapper open-close-time">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('openDayLabel')}</Form.Label>
                        <Form.Select
                            className="form-control"
                            size="lg"
                            onChange={onChangeHandler}
                            name='openDay'
                        >
                            {DayOfWeek.map(a => a === openDay ?
                                (<option key={a} selected value={a == null ? '' : a}>{translateDayOfWeek(a)}</option>) :
                                (<option key={a} value={a == null ? '' : a}>{translateDayOfWeek(a)}</option>)
                            )};
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('closeDayLabel')}</Form.Label>
                        <Form.Select
                            className="form-control"
                            name='closeDay'
                            size="lg"
                            onChange={onChangeHandler}>
                            {DayOfWeek.map(a => a === closeDay ?
                                (<option key={a} selected value={a == null ? '' : a}>{translateDayOfWeek(a)}</option>) :
                                (<option key={a} value={a == null ? '' : a}>{translateDayOfWeek(a)}</option>)
                            )}
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="row-wrapper">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('facebookLinkLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            name="facebookLink"
                            value={facebookLink}
                            onChange={onChangeHandler}
                            placeholder={t('facebookLinkPlaceHolder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('instagramLinkLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            name="instagramLink"
                            value={instagramLink}
                            onChange={onChangeHandler}
                            placeholder={t('instagramLinkPlaceHolder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('twitterLinkLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            name="twitterLink"
                            value={twitterLink}
                            onChange={onChangeHandler}
                            placeholder={t('twitterLinkPlaceHolder')} />
                    </Form.Group>
                </div>
                <button className="btn-primary">{t('submitButton')}</button>
            </div>
        </Form>
    </>)
}