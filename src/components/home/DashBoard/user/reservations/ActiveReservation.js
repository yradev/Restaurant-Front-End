import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { del, get } from "../../../../../core/connection";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import History from "./History";
import { translateStatus } from "../../../../../core/languages";

export default function ActiveReservation() {
    const [activeReservation, setActiveReservation] = useState();
    const { t } = useTranslation();
    const [isHistoryOpened, setIsHistoryOpened] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const result = await get('/reservations/active');
                if (result != null) {
                    result.reservationAt = new Date(result.reservationAt);
                    result.reservationFor = new Date(result.reservationFor);
                    setActiveReservation(result);
                }
            } catch (error) {
                setActiveReservation(null)
            }
        })();
    }, [])

    if (activeReservation === undefined) {
        return <Spinner />
    }

    async function cancelReservationHandler() {
        await del('/reservations/delete/' + activeReservation.id)
        setActiveReservation(null);
    }

    return (<>
        <h2>{t('activeReservationHeader')}</h2>
        {activeReservation !== null ? (<>
            <div className="row-wrapper">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip>
                            {t('receivedTimeTooltip')}
                        </Tooltip>
                    }>
                    <img src="/images/calendar.png" />
                </OverlayTrigger>
                <span>{activeReservation.reservationAt.toLocaleString()}</span>
            </div>
            <div className="row-wrapper">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip>
                            {t('reservationTimeTooltip')}
                        </Tooltip>
                    }>
                    <img src="/images/calendar.png" />
                </OverlayTrigger>
                <span>{activeReservation.reservationFor.toLocaleString()}</span>
            </div>
            <div className="row-wrapper">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip>
                            {t('countOfPersonTooltip')}
                        </Tooltip>
                    }>
                    <img src="/images/profile.png" />
                </OverlayTrigger>
                <span>{activeReservation.countOfGuests}</span>
            </div>
            <div className="row-wrapper">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip>
                            {t('phoneNumberTooltip')}
                        </Tooltip>
                    }>
                    <img src="/images/phone.png" />
                </OverlayTrigger>
                <span>{activeReservation.phoneNumber}</span>
            </div>
            <div className="row-wrapper">
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip>
                            {t('statusLabel')}
                        </Tooltip>
                    }>
                    <img src="/images/status.png" />
                </OverlayTrigger>

                <span>{translateStatus(activeReservation.status)}</span>

                {activeReservation.status === 'PENDING' ? (<>
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
                            onClick={cancelReservationHandler}
                        />
                    </OverlayTrigger>
                </>) : null}
            </div>

        </>) : (<>
            <p>
                {t('activeReservationEmpty')}
            </p>
        </>)}
        <div
            type='button'
            className='btn-primary'
            onClick={() => setIsHistoryOpened(true)}
        >
            {t('historyButton')}
        </div>
        {isHistoryOpened ? <History setIsHistoryOpened={setIsHistoryOpened} /> : null}

    </>)
}