import { useContext, useEffect, useState } from "react";
import { AuthenticationContext, CoreContext, ModalsContext, NavigationContext } from "../../fragments/Contexts";
import { Form } from "react-bootstrap";
import { getRememberMeDetails } from "../../core/storage";
import { useTranslation } from "react-i18next";

export default function Home() {
    const navigationContext = useContext(NavigationContext);
    const modalsControl = useContext(ModalsContext);
    const authentication = useContext(AuthenticationContext);

    const [error, setError] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { t } = useTranslation();

    const coreContext = useContext(CoreContext);

    useEffect(() => {
        navigationContext.useLargeNavigation('/images/home.jpg');
    }, []);

    useEffect(() => {
        if (getRememberMeDetails().data !== null) {
            const rememberMeData = getRememberMeDetails().data;

            const cryptoJS = require("crypto-js");

            setEmail(rememberMeData.email);
            setPassword(cryptoJS.AES.decrypt(rememberMeData.password, 'm//32le./wmk2ee3`1m,ek2;wo22../2wm').toString(cryptoJS.enc.Utf8));
        }
    }, []);

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'email':
                setEmail(value);
                if (error.field !== undefined) {
                    setError({});
                } break;
            case "password":
                setPassword(value);
                if (error.field !== undefined) {
                    setError({});
                } break;
            default: throw new Error();
        }
    }

    async function submitHandler(event) {
        event.preventDefault();

        let result;
        try {
            result = await authentication.login(email, password);
        } catch (error) {
            result = error.message;
        }

        if (result !== undefined) {
            if (result === '403') {
                setError({ field: "password", error: t('wrongPasswordError') });
            } else if (result === '404') {
                setError({ field: "email", error: t('notFoundEmailError') });
            }
        } else {
            if (event.target.rememberMe.checked) {
                const cryptoJS = require("crypto-js");

                const pass = cryptoJS.AES.encrypt(password, 'm//32le./wmk2ee3`1m,ek2;wo22../2wm').toString();
                getRememberMeDetails().setCredentionals({ email, password: pass });
            } else {
                getRememberMeDetails().clearCredentionals();
            }

        }
    }

    return <>
        <div className="home row-wrapper">
            <div className="welcome-info column-wrapper">
                <h2>
                    {coreContext.name}
                </h2>
                <h6>
                    {coreContext.subname}
                </h6>
            </div>
            <Form onSubmit={submitHandler}>
                <div className="main-auth column-wrapper">
                    <h3>{t('loginHeader')}</h3>
                    <Form.Group>
                        <Form.Control
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={onChangeHandler}
                            placeholder={t('emailAddressPlaceholder')}
                            isInvalid={error.field === "email"} />
                        <Form.Control.Feedback
                            type='invalid'
                            className="invalid-input"
                        >
                            {error.error}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Control type="password"
                            required
                            value={password}
                            name="password"
                            onChange={onChangeHandler}
                            placeholder={t('passwordPlaceholder')}
                            isInvalid={error.field === "password"} />

                        <Form.Control.Feedback
                            type='invalid'
                            className="invalid-input"
                        >
                            {error.error}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="row-wrapper" style={{ gap: 30 }}>
                        <Form.Check
                            className='remember-me'
                            type="checkbox"
                            name="rememberMe"
                            defaultChecked={getRememberMeDetails().data !== null}
                            label={t('rememberMeLabel')} />

                        <button
                            type='button'
                            className="forgot-password"
                            onClick={() => modalsControl.updateForgotPassword(true)}
                        >
                            {t('forgotPasswordLabel')}
                        </button>
                    </div>
                    <button
                        type='button'
                        className="new-registration"
                        onClick={() => modalsControl.updateRegistration(true)}
                    >
                        {t('newRegistrationLabel')}
                    </button>
                    <button type="submit">{t('submitButton')}</button>
                </div>
            </Form>
        </div>
    </>;
}