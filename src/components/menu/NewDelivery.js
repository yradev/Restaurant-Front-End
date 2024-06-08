import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext, ItemsPanelContext, ModalsContext } from '../../fragments/Contexts';
import { getDeliveriesBagActions } from '../../core/storage';
import { get, post } from '../../core/connection';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function NewDelivery({ opened, items, totalPrice }) {
    const [show, setShow] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const itemsContext = useContext(ItemsPanelContext);
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const authentication = useContext(AuthenticationContext);
    const modalsContext = useContext(ModalsContext)

    useEffect(() => {
        (async () => {
            try {
                await get('/deliveries/active');
                navigate('/panel/user');
                handleClose();
            } catch (error) {
            }
        })();
    }, [navigate]);

    async function handleSubmit(event) {
        event.preventDefault();
        authentication.checkAuth();

        if (!authentication.isLogged) {
            modalsContext.updateLogin(true);
            return;
        }

        try {
            await post('/deliveries/add', {
                address: address,
                phoneNumber: phoneNumber,
                receivedTime: new Date(),
                items: items.map(a => {
                    return {
                        categoryName: a.categoryName,
                        itemName: a.itemName,
                        count: a.count,
                        price: a.price
                    }
                })
            });
            getDeliveriesBagActions().clear();
            itemsContext.updateDeliveriesBag();
            handleClose();
            navigate('/panel/user')
        } catch (error) {
        }
    };

    function addOne(id) {
        getDeliveriesBagActions().addItem(id);
        itemsContext.updateDeliveriesBag();
    }


    function removeOne(id) {
        getDeliveriesBagActions().removeOneFromItem(id);
        itemsContext.updateDeliveriesBag();
    }

    function removeItem(id) {
        getDeliveriesBagActions().removeItem(id);
        itemsContext.updateDeliveriesBag();
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'address': setAddress(value); break;
            case 'phoneNumber': setPhoneNumber(value); break;
            default: throw new Error();
        };
    }

    function handleClose() {
        setShow(false);
        opened(false);
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size='lg'
        >
            <Modal.Header>
                <Modal.Title>
                    <h3>{t('newDeliveryHeader')}</h3>
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className='items-modal-body'>
                    <div className='items'>
                        <div className='item'>
                            <span>{t('menuLabel')}</span>
                            <span>{t('productLabel')}</span>
                            <span>{t('countLabel')}</span>
                            <span>{t('singlePriceLabel')}</span>
                            <span>{t('totalPriceLabel')}</span>
                            <div className='actions'>{t('actionsLabel')}</div>
                        </div>
                        {items.map(item => (
                            <div className='item' key={items.indexOf(item)}>
                                <span>{item.categoryName}</span>
                                <span>{item.itemName}</span>
                                <span>{item.count}</span>
                                <span>{item.price.toFixed(2)} BGN</span>
                                <span>{item.total.toFixed(2)} BGN</span>
                                <div className='actions row-wrapper'>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {t('addOneTooltip')}
                                            </Tooltip>
                                        }>

                                        <img src='/images/plus.png'
                                            type='button'
                                            onClick={() => {
                                                addOne(item.id);
                                            }} />
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {t('deleteOneTooltip')}
                                            </Tooltip>
                                        }>
                                        <img src='/images/minus.png' type='button' onClick={() => {
                                            removeOne(item.id);
                                        }} />
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {t('deleteAllTooltip')}
                                            </Tooltip>
                                        }>

                                        <img src='/images/delete.png' type='button' onClick={() => {
                                            removeItem(item.id);
                                        }} />
                                    </OverlayTrigger>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='details row-wrapper'>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Control
                                as='textarea'
                                rows={2}
                                type="text"
                                name="address"
                                required
                                minLength={5}
                                maxLength={50}
                                value={address}
                                onChange={onChangeHandler}
                                placeholder={t('deliveryAddressPlaceholder')} />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Control
                                as='textarea'
                                rows={2}
                                name="phoneNumber"
                                pattern="[0-9+]+"
                                required
                                value={phoneNumber}
                                min={5}
                                max={30}
                                onChange={onChangeHandler}
                                placeholder={t('phoneNumberPlaceHolder')} />
                        </Form.Group>

                        <div className='total'>
                            {t('totalPriceAlert')} {totalPrice.toFixed(2)} BGN.
                        </div>
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