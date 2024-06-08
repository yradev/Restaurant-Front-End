import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { post } from '../../../../core/connection';
import { Spinner } from 'react-bootstrap';

export default function AddProduct({ isModalOpened, updater, categoryPosition }) {
    const [show, setShow] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState(null);
    const [image, setImage] = useState();
    const [imageError, setImageError] = useState();
    const { t } = useTranslation();

    function handleClose() {
        setShow(false);
        isModalOpened(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setWaiting(true);
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('categoryPosition', categoryPosition);

            await post('/items/add', formData);
            updater.update();
            handleClose();
        } catch (error) {
            setError(t('itemConflictError'))
        }finally{
            setWaiting(false);
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'price': setPrice(value); break;
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
            default: new Error();
        }

        if (error !== null) {
            setError(null);
        }
    }


    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header className='modal-form-header'>
                <Modal.Title> <h3>{t('newProductHeader')}</h3> </Modal.Title>
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
                            value={name}
                            onChange={onChangeHandler}
                            placeholder={t('productNamePlaceholder')}
                            isInvalid={error !== null} />
                        <Form.Control.Feedback
                            type='invalid' className='invalid-input'>
                            {error}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
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
                            placeholder={t('productDescriptionPlaceholder')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('priceLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            min="1"
                            step="0.01"
                            required
                            value={price}
                            onChange={onChangeHandler}
                            placeholder={t('productPricePlaceholder')} />
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