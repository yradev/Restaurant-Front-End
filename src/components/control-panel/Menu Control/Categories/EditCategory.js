import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { post, put } from '../../../../core/connection';
import { Spinner } from 'react-bootstrap';

export default function EditCategory({ closeModal, data, updater }) {
    const [show, setShow] = useState(true);
    const [name, setName] = useState(data.name);
    const [description, setDescription] = useState(data.description);
    const [position, setPosition] = useState(data.position);
    const [image, setImage] = useState(data.imageUrl);
    const [imageError, setImageError] = useState();
    const [imageFail, setImageFail] = useState();
    const [waiting, setWaiting] = useState(false);

    const [dataError, setError] = useState({
        field: null,
        message: null,
        setNewError(field, message) {
            const tempError = { ...dataError };
            tempError.field = field;
            tempError.message = message;
            setError(tempError);
        },
        clean() {
            const tempError = { ...dataError };
            tempError.field = null;
            tempError.message = null;
            setError(tempError);
        }
    });
    const { t } = useTranslation();

    function handleClose() {
        setShow(false);
        closeModal();
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();

        if (imageFail !== undefined) {
            formData.append('image', imageFail);
        }

        formData.append('name', name)
        formData.append('description', description)
        formData.append('position', position)
        setWaiting(true);
        try {
            await put('/categories/edit/' + data.position, formData)
            updater.update();
            handleClose();
        } catch (error) {
            switch (error.message) {
                case '409': dataError.setNewError('name', t('menuConflictError')); break;
                case '400': dataError.setNewError('position', t('invalidPositionError')); break;
                default: throw new Error();
            }
        } finally {
            setWaiting(false);
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'description': setDescription(value); break;
            case 'position': setPosition(value); break;
            case 'image':
                if (setImage !== undefined) {
                    setImageError(undefined);
                }

                const file = event.target.files[0];

                if (!file.type.includes('image')) {
                    event.target.value = null;
                    setImageError(t('invalidImageFormatError'))
                } else if (file.size > 1048576) {
                    event.target.value = null;
                    setImageError(t('invalidImageSizeError'))
                }
                else {
                    setImageFail(file);
                    setImage(URL.createObjectURL(file))
                }
                break;
            default: throw new Error();
        }

        dataError.clean();
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header className='modal-form-header'>
                <Modal.Title> <h3>{t('editCategoryHeader')}</h3> </Modal.Title>
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
                            onChange={onChangeHandler}
                            isInvalid={imageError !== undefined}
                        />

                        <Form.Control.Feedback
                            type='invalid' className='invalid-input'>
                            {imageError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <img
                        src={image}
                        style={{
                            width: '50px',
                            height: '50px',
                            margin: '5px 0 10px 0',
                            opacity: 1
                        }}
                        alt='Not found'
                    />

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
                            placeholder={t('menuNamePlaceholder')}
                            isInvalid={dataError.field === 'name'} />
                        <Form.Control.Feedback
                            type='invalid' className='invalid-input'>
                            {dataError.message}
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
                            placeholder={t('menuDescriptionPlaceholder')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('positionLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="position"
                            required
                            min='1'
                            max={data.total}
                            value={position}
                            onChange={onChangeHandler}
                            placeholder={t('menuPositionPlaceholder')}
                            isInvalid={dataError.field === 'position'} />
                        <Form.Control.Feedback
                            type='invalid' className='invalid-input'>
                            {dataError.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{
                    border: 0,
                }}>
                    <button type='submit' className='btn-primary'>
                        {waiting ? <Spinner size='sm'/> :
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