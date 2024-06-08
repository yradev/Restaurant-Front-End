import { useContext, useEffect, useState } from "react";
import { ModalsContext, NavigationContext } from "../../../fragments/Contexts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get, put } from "../../../core/connection";
import { useTranslation } from "react-i18next";
import { Alert, Form } from "react-bootstrap";
import NotFound from "../../error/NotFound";

export default function PasswordReset() {
    const navigationContext = useContext(NavigationContext);
    const params = useSearchParams()[0];
    const { t } = useTranslation();
    const [allow, setAllow] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [alert, setAlert] = useState();
    const modalsControl = useContext(ModalsContext);
    const navigate = useNavigate();
    const emailParam = params.get('email');
    const tokenParam = params.get('token');

    useEffect(() => {
        (async () => {
            const result = await get('/auth/reset-password/verify/' + emailParam + '/' + tokenParam);

            if (result === false) {
                setAllow(false);
            } else {
                navigationContext.useSmallNavigation();
            }
        })();
    }, [emailParam, tokenParam]);

    if (allow !== undefined) {
        if (!allow) {
            return (<NotFound />);
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'password': setPassword(value); break;
            case 'confirmPassword': setConfirmPassword(value); break;
            default: throw new Error();
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const token = params.get('token');
            await put('/auth/reset-password/' + params.get('email'), { password, token })
            navigate('/')
            modalsControl.updateLogin(true, t('passwordChanged'));
        } catch (err) {
            if (err.message === '400') {
                setAlert(t('tokenExpiredResetPassword'))
            }
        }
    }


    return (<>
        <div className="field reset-password column-wrapper">
            <h2>{t('resetPasswordHeader')}</h2>

            {alert !== undefined ?
                (<Alert variant='success'>
                    {alert}</Alert>)
                : null}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        {t('passwordLabel')}
                    </Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        onChange={onChangeHandler}
                        placeholder={t('passwordPlaceholder')}
                        minLength="5"
                        required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        {t('confirmPasswordLabel')}
                    </Form.Label>
                    <Form.Control
                        type="password"
                        name='confirmPassword'
                        placeholder={t('confirmPasswordPlaceholder')}
                        onChange={onChangeHandler}
                        isInvalid={confirmPassword !== password}
                        required />
                    <Form.Control.Feedback type='invalid' className="invalid">{t('notEqualPasswords')}</Form.Control.Feedback>
                </Form.Group>
                <button type="submit" className="btn-primary">{t('submitButton')}</button>
            </Form >
        </div >
    </>)
}