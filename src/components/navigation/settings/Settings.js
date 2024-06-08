import React, { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { AuthenticationContext, ModalsContext } from '../../../fragments/Contexts';
import { Form } from 'react-bootstrap';
import { getRememberMeDetails } from '../../../core/storage';
import { del, put } from '../../../core/connection';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Settings() {
    const [show, setShow] = useState(true);
    const { t } = useTranslation();
    const modalsControl = useContext(ModalsContext);
    const [emailSettingsOpened, setEmailSettingsOpened] = useState(false);
    const [passwordSettingOpened, setPasswordSettingOpened] = useState(false);
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const auth = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const [emailAlert, setEmailAlert] = useState();
    const [currentPasswordAlert, setCurrentPasswordAlert] = useState()

    function handleClose() {
        setShow(false);
        modalsControl.updateSettings(false);
    }

    function handleOpen() {
        setShow(true);
        modalsControl.updateSettings(true);
    }
    function deleteHandler() {
        handleClose()
        const options = {
            title: t('deleteHeader'),
            message: t('deleteConfirmAlert'),

            buttons: [
                {
                    label: t('YesButton'),
                    onClick: async () => {
                        await del('/user/delete');
                        handleClose();
                        navigate('/');
                        auth.logout();
                        getRememberMeDetails().clearCredentionals();
                    }
                },
                {
                    label: t('NoButton'),
                    onClick: () => handleOpen()
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            willUnmount: () => { },
            afterClose: () => { },
            onClickOutside: () => { },
            onKeypress: () => { },
            onKeypressEscape: () => { }
        };

        confirmAlert(options);
    };

    async function changePasswordHandler(event) {
        event.preventDefault();
        if (newPassword === confirmPassword) {
            try {
                await put('/user/change/password', {
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
                handleClose();
                navigate('/');
                auth.logout();
                getRememberMeDetails().clearCredentionals();
                modalsControl.updateLogin(true);

            } catch (error) {
                if (error.message === '400') {
                    setCurrentPasswordAlert(t('currentPasswordError'))
                }
            }
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'email':
                setEmail(value);
                if (emailAlert !== undefined) {
                    setEmailAlert(undefined);
                }
                break;
            case 'currentPassword': setCurrentPassword(value);
                if (currentPasswordAlert) {
                    setCurrentPasswordAlert(undefined);
                }
                break;
            case 'newPassword': setNewPassword(value); break;
            case 'confirmPassword': setConfirmPassword(value); break;
            default: throw new Error();
        }
    }

    async function submitEmailChangeHandler(event) {
        event.preventDefault();
        try {
            await put('/user/change/email/' + email)
            handleClose();
            navigate('/');
            auth.logout();
            getRememberMeDetails().clearCredentionals();
            modalsControl.updateLogin(true);

        } catch (error) {
            if (error.message === '409') {
                setEmailAlert(t('conflictEmailError'))
            }
        }
    }
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header className='modal-form-header'>
                <Modal.Title> <h3>{t('settingsHeader')}</h3> </Modal.Title>
            </Modal.Header>
            <Modal.Body className='column-wrapper user-settings-body'>
                <div className='column-wrapper'>
                    <div
                        type='button'
                        className='row-wrapper slider-header'
                        onClick={() => setEmailSettingsOpened(!emailSettingsOpened)}
                    >
                        {t('changeEmailSetting')}
                        {!emailSettingsOpened ? <>
                            <img src='/images/slider-arrows.png' />
                        </> :
                            <img src='/images/slider-arrows-up.png' />
                        }
                    </div>
                    {emailSettingsOpened ? <>
                        <div className='slider-body fade-in column-wrapper'>
                            <h6>{auth.email}</h6>
                            <Form className='column-wrapper' onSubmit={submitEmailChangeHandler}>
                                <div style={{ width: '100%' }}>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder={t('newEmailAddressPlaceholder')}
                                        value={email}
                                        name="email"
                                        minLength='5'
                                        maxLength='30'
                                        onChange={onChangeHandler}
                                        isInvalid={emailAlert !== undefined} />
                                    <Form.Control.Feedback
                                        type='invalid'
                                        className='invalid-input'>
                                        {emailAlert}
                                    </Form.Control.Feedback>
                                </div>
                                <button type='submit' className='btn-primary'>{t('submitButton')}</button>
                            </Form>
                        </div>
                    </> : null}
                </div>
                <div className='column-wrapper'>
                    <div
                        type='button'
                        className='row-wrapper slider-header'
                        onClick={() => setPasswordSettingOpened(!passwordSettingOpened)}
                    >
                        {t('changePasswordSetting')}
                        {!passwordSettingOpened ? <>
                            <img src='/images/slider-arrows.png' />
                        </> :
                            <img src='/images/slider-arrows-up.png' />
                        }
                    </div>
                    {passwordSettingOpened ? <>
                        <div className='slider-body fade-in'>
                            <Form className='column-wrapper' onSubmit={changePasswordHandler}>
                                <div style={{ width: '100%' }}>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder={t('currentPasswordPlaceholder')}
                                        value={currentPassword}
                                        minLength='5'
                                        name="currentPassword"
                                        onChange={onChangeHandler}
                                        isInvalid={currentPasswordAlert !== undefined} />
                                    <Form.Control.Feedback
                                        type='invalid'
                                        className='invalid-input'>
                                        {currentPasswordAlert}
                                    </Form.Control.Feedback>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder={t('newPasswordPlaceholder')}
                                        value={newPassword}
                                        name="newPassword"
                                        minLength='5'
                                        onChange={onChangeHandler} />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder={t('confirmPasswordPlaceholder')}
                                        value={confirmPassword}
                                        name="confirmPassword"
                                        minLength='5'
                                        onChange={onChangeHandler}
                                        isInvalid={newPassword !== confirmPassword} />
                                    <Form.Control.Feedback
                                        type='invalid'
                                        className='invalid-input'>
                                        {t('notEqualPasswords')}
                                    </Form.Control.Feedback>
                                </div>
                                <button type='submit' className='btn-primary'>{t('submitButton')}</button>
                            </Form>
                        </div>
                    </> : null}
                </div>
                <button className='btn-primary delete-account' onClick={deleteHandler}>{t('deleteAccountButton')}</button>
            </Modal.Body>
            <Modal.Footer style={{
                border: 0
            }}>
                <button
                    type='button'
                    className='btn-secondary'
                    style={{ width: '100%' }}
                    onClick={() => handleClose()}>
                    {t('closeButton')}
                </button>
            </Modal.Footer>
        </Modal>
    );
}