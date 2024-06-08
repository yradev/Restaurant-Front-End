import React, { useState } from 'react';
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { AuthenticationContext, ModalsContext } from '../../../fragments/Contexts';

export default function Registration() {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState({});
  const [confirmPassword, setConfirmPassword] = useState();

  const { t } = useTranslation();

  const auth = useContext(AuthenticationContext);
  const modalsControl = useContext(ModalsContext);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      return;
    }

    try {
      await auth.registration(email, password);
      handleClose()
      modalsControl.updateLogin(true, t('userRegisteredAlert'));
    } catch (error) {
      if (error.message === '409') {
        setError({ field: "email", message: t('conflictEmailError') });
      }
    }

  }

  function onChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case "email":
        setEmail(value);
        if (error.field === "email") {
          error.field = null;
        }
        break;
      case "password": setPassword(value); break;
      case "confirmPassword": setConfirmPassword(value); break;
      default: throw new Error();
    }
  }

  function handleClose() {
    setShow(false);
    modalsControl.updateRegistration(false);
  }


  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header className='modal-form-header'>
        <Modal.Title> <h3>{t('registrationHeaader')}</h3> </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                {t('emailAddressLabel')}
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={onChangeHandler}
                placeholder={t('emailAddressPlaceholder')}
                isInvalid={error.field === "email"}
                required />
              <Form.Control.Feedback type='invalid' className='invalid-input'>{error.message}</Form.Control.Feedback>
            </Form.Group>
          </div>
          <div>
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
          </div>
          <div>
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
              <Form.Control.Feedback type='invalid' className='invalid-input'>{t('notEqualPasswords')}</Form.Control.Feedback>
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