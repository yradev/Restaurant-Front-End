import { useEffect } from "react";
import { useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { get, put } from "../../../../../core/connection";
import Pagination from "../../../../../fragments/Pagination";
import History from "./History";
import { translateStatus } from "../../../../../core/languages";
import { useTranslation } from "react-i18next";

export default function ActiveReservations() {
    const [reservations, setReservations] = useState();
    const [page, setPage] = useState(0);
    const [isHistoryOpened, setIsHistoryOpened] = useState(false);
    const [updater, setUpdater] = useState({
        counter: 0,
        update() {
            this.counter += 1;
            setUpdater({ ...this })
        }
    });

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const result = await get('/reservations/staff/active');

                const splitBy10 = [];

                result.forEach(a => {
                    a.reservationAt = new Date(a.reservationAt);
                    a.reservationFor = new Date(a.reservationFor);
                })

                for (let index = 0; index < result.length; index += 10) {
                    splitBy10.push(result
                        .slice(index, index + 10))
                }

                if (splitBy10.length === 0) {
                    setReservations(null);
                } else {
                    setReservations(splitBy10);
                }
            } catch (error) {
                setReservations(null)
            }
        })();
    }, [updater])

    if (reservations === undefined) {
        return <Spinner />
    }

    async function acceptHandler(id) {
        await put('/reservations/status/' + id + '/ACCEPTED');
        updater.update();
    }

    async function canceledHandler(id) {
        await put('/reservations/status/' + id + '/HISTORY');
        updater.update();
    }

    return (<>
        <h2>{t('activeReservationsHeader')}</h2>
        {reservations === null ?
            <p>{t('activeReservationsEmpty')}</p>
            : (<>
                <div className="row-wrapper staff-active-reservations">
                    <span>{t('reservationFromLabel')}</span>
                    <span>{t('reservationForLabel')}</span>
                    <span>{t('statusLabel')}</span>
                    <span>{t('detailsLabel')}</span>
                </div>
                {reservations[page].map(reservation => (
                    <div className="row-wrapper staff-active-reservations">
                        <span>{reservation.reservationAt.toLocaleString()}</span>
                        <span>{reservation.reservationFor.toLocaleString()}</span>
                        <div className="row-wrapper actions">
                            <span>
                                {translateStatus(reservation.status)}
                            </span>
                            {reservation.status === 'PENDING' ? (<>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {t('acceptTooltip')}
                                        </Tooltip>
                                    }>

                                    <img
                                        type='button'
                                        src="/images/yes.png"
                                        onClick={() => acceptHandler(reservation.id)}
                                    />
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {t('deleteTooltip')}
                                        </Tooltip>
                                    }>
                                    <img
                                        type='button'
                                        src="/images/delete.png"
                                        onClick={() => canceledHandler(reservation.id)}
                                    />
                                </OverlayTrigger>
                            </>) : null}
                            {reservation.status === 'ACCEPTED' ? (<>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {t('deleteTooltip')}
                                        </Tooltip>
                                    }>
                                    <img
                                        type='button'
                                        src="/images/delete.png"
                                        onClick={() => canceledHandler(reservation.id)}
                                    />
                                </OverlayTrigger>
                            </>) : null}
                        </div>
                        <div className="row-wrapper">
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {reservation.phoneNumber}
                                    </Tooltip>
                                }>
                                <img src="/images/phone.png"></img>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {reservation.countOfGuests}
                                    </Tooltip>
                                }>
                                <img src="/images/profile.png"></img>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {reservation.userUsername}
                                    </Tooltip>
                                }>
                                <img src="/images/profile.png"></img>
                            </OverlayTrigger>
                        </div>
                    </div>
                ))}
            </>
            )}

        <div className="actions row-wrapper">
            {reservations !== null ? (<>
                <Pagination
                    items={reservations}
                    page={page}
                    setPage={setPage}
                />
            </>) : null}
            <button
                type='button'
                className="btn-primary"
                onClick={() => { setIsHistoryOpened(true) }}
            >
                {t('historyButton')}
            </button>
        </div>
        {isHistoryOpened ? <History setIsHistoryOpened={setIsHistoryOpened} /> : null}
    </>);
}