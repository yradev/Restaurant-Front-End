import Modal from 'react-bootstrap/Modal';
import { get } from "../../../../../core/connection";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import Pagination from '../../../../../fragments/Pagination';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { translateStatus } from '../../../../../core/languages';

export default function History({ setIsHistoryOpened }) {
    const [data, setData] = useState();
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            const result = await get('/reservations/history/staff');

            const splitBy10 = [];

            result.forEach(a => {
                a.reservationAt = new Date(a.reservationAt);
                a.reservationFor = new Date(a.reservationFor);
            })

            for (let index = 0; index < result.length; index += 10) {
                splitBy10.push(result
                    .slice(index, index + 10))
            }

            setData(splitBy10);
        })()
    }, []);

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
            <Modal.Body className='items-modal-body reservation-modal-body'>
                <div className='items'>
                    <div className='item'>
                        <span>{t('reservationFromLabel')}</span>
                        <span>{t('reservationForLabel')}</span>
                        <span>{t('statusLabel')}</span>
                        <span>{t('detailsLabel')}</span>
                    </div>
                    {data.length === 0 ? null : <>
                        {data[page].map(item => (
                            <div className='item' key={data[page].indexOf(item)}>
                                <span>
                                    {item.reservationAt.toLocaleString()}
                                </span>
                                <span>
                                    {item.reservationFor.toLocaleString()}
                                </span>
                                <span>
                                    {translateStatus(item.status)}
                                </span>
                                <div className='row-wrapper details'>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {item.phoneNumber}
                                            </Tooltip>
                                        }>
                                        <img src="/images/phone.png"></img>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {item.countOfGuests}
                                            </Tooltip>
                                        }>
                                        <img src="/images/profile.png"></img>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement='top'
                                        overlay={
                                            <Tooltip>
                                                {item.userUsername}
                                            </Tooltip>
                                        }>
                                        <img src="/images/profile.png"></img>
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
        </Modal >
    </>);
}