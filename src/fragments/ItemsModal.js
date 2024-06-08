import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function ItemsModal({ items, opened }) {
    const [show, setShow] = useState(true);
    const { t } = useTranslation();

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
                    <h3>{t('productsHeader')}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='items-modal-body'>
                <div className='items'>
                    <div className='item'>
                        <span>{t('menuLabel')}</span>
                        <span>{t('productLabel')}</span>
                        <span>{t('countLabel')}</span>
                        <span>{t('singlePriceLabel')}</span>
                        <span>{t('totalPriceLabel')}</span>
                    </div>
                    {items.map(item => (
                        <div className='item' key={items.indexOf(item)}>
                            <span>{item.categoryName}</span>
                            <span>{item.itemName}</span>
                            <span>{item.count}</span>
                            <span>{item.price.toFixed(2)} BGN</span>
                            <span>{(item.price*item.count).toFixed(2)} BGN</span>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer style={{
                border: 0,
            }}>
                <button
                    type='button'
                    className='btn-secondary'
                    style={{width: '100%'}}
                    onClick={() => handleClose()}>
                    {t('closeButton')}
                </button>
            </Modal.Footer>
        </Modal>
    );
}