import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { post } from '../../../../core/connection';
import { Spinner } from 'react-bootstrap';

export default function AddCategory({ isModalOpened, updater }) {
    const [show, setShow] = useState(true);
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [nameError, setNameError] = useState(null);
    const [image, setImage] = useState();
    const [imageError, setImageError] = useState();
    const [waiting, setWaiting] = useState(false);
    const { t } = useTranslation();

    function handleClose() {
        setShow(false);
        isModalOpened(false);
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'description': setDescription(value); break;
            case 'image':
                if (imageError !== undefined) {
                    setImageError(undefined);
                }
                const file = event.target.files[0];
                if (!file.type.includes('image')) {
                    event.target.value = null;
                    setImageError(t('invalidImageFormatError'))
                } else if (file.size > 1048576) {
                    event.target.value = null;
                    setImageError(t('invalidImageSizeError'))

                } else {
                    setImage(file);
                } break;
            default: throw new Error();
        }

        setNameError(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setWaiting(true);
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', name)
            formData.append('description', description)

            await post('/categories/add', formData);
            updater.update();
            handleClose();
        } catch (error) {
            setNameError(t('menuConflictError'))
        } finally {
            setWaiting(false);
        }
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header className='modal-form-header'>
                <Modal.Title> <h3>{t('addCategoryHeader')}</h3> </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('imageLabel')}
                        </Form.Label>

                        <Form.Control
                            type="file"
                            name="image"
                            required
                            onChange={onChangeHandler}
                            isInvalid={imageError !== undefined} />
                        <Form.Control.Feedback
                            type='invalid' className='invalid-input'>
                            {imageError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('nameLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            minLength='3'
                            maxLength='20'
                            value={name == null ? '' : name}
                            onChange={onChangeHandler}
                            placeholder={t('menuNamePlaceholder')}
                            isInvalid={nameError !== null} />
                        <Form.Control.Feedback
                            type='invalid' className='invalid-input'>
                            {nameError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('descriptionLabel')}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            required
                            minLength='1'
                            maxLength='30'
                            value={description}
                            onChange={onChangeHandler}
                            placeholder={t('menuDescriptionPlaceholder')} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{
                    border: 0,
                }}>
                    <button type='submit' className='btn-primary'>
                        {waiting ? <Spinner size='sm' /> :
                            (<>
                                {t('submitButton')}
                            </>
                            )}
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