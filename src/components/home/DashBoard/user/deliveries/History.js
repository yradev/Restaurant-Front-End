import Modal from 'react-bootstrap/Modal';
import { get } from "../../../../../core/connection";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import Pagination from '../../../../../fragments/Pagination';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function History({ setIsHistoryOpened }) {
    const [data, setData] = useState();
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const result = await get('/deliveries/history/user');

                const splitBy5 = [];

                result.forEach(a => {
                    a.receiveTime = new Date(a.receiveTime);
                })

                for (let index = 0; index < result.length; index += 5) {
                    splitBy5.push(result
                        .slice(index, index + 5))
                }

                console.log(splitBy5);
                setData(splitBy5);
            } catch (error) {
                setData(undefined)
            }
        })();
    }, [])

    if (data === undefined) {
        return;
    }

    function handleClose() {
        setShow(false);
        setIsHistoryOpened(false);
    }

    return (<>
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size='lg'
        >
            <Modal.Header>
                <Modal.Title>
                    <h3>{t('historyButton')}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='items-modal-body'>
                <div className='items deliveries-modal-body'>
                    <div className='item'>
                        <span>{t('HourLabel')}</span>
                        <span>{t('totalPriceLabel')}</span>
                        <span>{t('statusLabel')}</span>
                        <span>{t('detailsLabel')}</span>
                    </div>
                    {data.length === 0 ? null : <>
                        {data[page].map(item => (
                            <div className='item' key={data[page].indexOf(item)}>
                                <span>{item.receiveTime.toLocaleString()}</span>
                                <span>{item.totalPrice.toFixed(2)} BGN</span>
                                <span>{item.status}</span>
                                <div className="row-wrapper details">
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {item.address}
                                            </Tooltip>
                                        }>
                                        <img src="/images/house.png"></img>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {item.phoneNumber}
                                            </Tooltip>
                                        }>
                                        <img src="/images/phone.png"></img>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        ))}
                    </>}
                </div>
            </Modal.Body>
            <Modal.Footer
                className='row-wrapper'
                style={{
                    border: 0,
                }}>
                <Pagination
                    items={data}
                    page={page}
                    setPage={setPage}
                />
                <button
                    type='button'
                    className='btn-secondary'
                    onClick={() => handleClose()}>
                    {t('closeButton')}
                </button>
            </Modal.Footer>
        </Modal>
    </>);
}