import React, { useState } from 'react';
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { AuthenticationContext, ModalsContext } from '../../../fragments/Contexts';
import { Alert } from 'react-bootstrap';

export default function ForgotPassword() {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState();
  const [alert, setAlert] = useState();
  const modalsControl = useContext(ModalsContext);

  function handleClose() {
    setShow(false);
    modalsControl.updateForgotPassword(false);
  }

  const auth = useContext(AuthenticationContext);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await auth.forgotPassword(email);

      setAlert(t('checkEmailVerification'))
      setError(undefined);

    } catch (err) {
      if (err.message === '404') {
        setError(t('notFoundEmailError'));
      }

      if (err.message === '409') {
        if (alert !== undefined) {
          setAlert(undefined)
        }
        setError(t('haveVerification'))
      }
    }
  }

  function onChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'email': setEmail(value); break;
      default: throw new Error();
    }

    setError(undefined);
    setAlert(undefined);
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header className='modal-form-header'>
        <Modal.Title> <h3>{t('forgotPasswordHeader')}</h3> </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {alert !== undefined ?
            <Alert
              variant='info'
              style={{ textAlign: 'center', textShadow: 'none' }}>
              {alert}
            </Alert>
            : null}
          <div>
            <Form.Group>
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
                isInvalid={error !== undefined} />
              <Form.Control.Feedback
                type='invalid'
                className='invalid-input'
              >
                {error}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
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