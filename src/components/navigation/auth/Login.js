import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext, ModalsContext } from '../../../fragments/Contexts';
import { getRememberMeDetails } from '../../../core/storage';
import { Alert } from 'react-bootstrap';

export default function Login() {
  const [show, setShow] = useState(true);
  const [error, setError] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const modalsControl = useContext(ModalsContext);

  const auth = useContext(AuthenticationContext);
  const rememberMeData = getRememberMeDetails().data;
  useEffect(() => {
    if (auth.isLogged) {
      auth.update();
    }
  }, [auth])

  useEffect(() => {
    if (rememberMeData !== null) {
   
      const cryptoJS = require("crypto-js");
      setEmail(rememberMeData.email);
      setPassword(cryptoJS.AES.decrypt(rememberMeData.password, 'm//32le./wmk2ee3`1m,ek2;wo22../2wm').toString(cryptoJS.enc.Utf8));
    }
  }, []);

  const { t } = useTranslation();

  function openForgotPasswordHandler() {
    handleClose()
    modalsControl.updateForgotPassword(true);
  }

  function openRegistrationHandler() {
    handleClose();
    modalsControl.updateRegistration(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let result;
    try {
      result = await auth.login(email, password);
    } catch (error) {
      result = error.message;
    }

    if (result !== undefined) {
      if (result === '403') {
        setError({ field: "password", error: 'Паролата е грешна!' });
      } else if (result === '404') {
        setError({ field: "email", error: 'Не е намерен потребител с такъв имейл!' });
      }
    } else {
      if (event.target.rememberMe.checked) {
        const cryptoJS = require("crypto-js");

        const pass = cryptoJS.AES.encrypt(password, 'm//32le./wmk2ee3`1m,ek2;wo22../2wm').toString();
        getRememberMeDetails().setCredentionals({email, password: pass});
      } else {
        getRememberMeDetails().clearCredentionals();
      }

      handleClose();
    }
  };

  function onChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'email': setEmail(value); break;
      case "password": setPassword(value); break;
      default: throw new Error();
    }
  }

  function handleClose() {
    setShow(false);
    modalsControl.updateLogin(false);

  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header className='modal-form-header'>
        <Modal.Title> <h3>{t('loginHeader')}</h3> </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {modalsControl.loginNotification !== undefined ?
            <Alert
              variant='success' style={{ textAlign: 'center', textShadow: 'none' }}>{modalsControl.loginNotification}</Alert>
            : null}
          <div>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>
                {t('emailAddressLabel')}
              </Form.Label>
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
                className='invalid-input'
                style={{ fontWeight: 600 }}
              >
                {error.error}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div>
            <Form.Group
              className="mb-3" >
              <Form.Label>
                {t('passwordLabel')}
              </Form.Label>

              <Form.Control type="password"
                required
                value={password}
                name="password"
                onChange={onChangeHandler}
                placeholder={t('passwordPlaceholder')}
                isInvalid={error.field === "password"} />

              <Form.Control.Feedback
                type='invalid'
                className='invalid-input'
              >
                {error.error}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className='more-options'>
            <Form.Group>
              <Form.Check
                className='modal-form-remember-me-checkbox'
                type="checkbox"
                name="rememberMe"
                defaultChecked={getRememberMeDetails().data !== null}
                label={t('rememberMeLabel')} />
            </Form.Group>
            <button
              type='button'
              onClick={openForgotPasswordHandler}
              className="btn-transperant btn-custom mb-4"
              style={{ fontSize: 'small' }}>
              {t('forgotPasswordLabel')}
            </button>
          </div>
          <button
            type='button'
            className="btn-transperant"
            style={{ fontSize: 'medium' }}
            onClick={openRegistrationHandler}>
            {t('newRegistrationLabel')}
          </button>
        </Modal.Body>
        <Modal.Footer style={{
          border: 0,
        }}>
          <button type='submit' className='btn-primary'>
            {t('submitButton')}
          </button>

          <button
            type='button'
            className='btn-secondary'
            onClick={() => handleClose()}>
            {t('closeButton')}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}