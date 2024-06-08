import { useEffect } from "react";
import { useState } from "react";
import { del, get, put } from "../../../../../core/connection";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import History from "./History";
import ItemsModal from "../../../../../fragments/ItemsModal";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../../../../core/languages";

export default function ActiveDelivery() {
    const [activeDelivery, setActiveDelivery] = useState();
    const [isHistoryOpened, setIsHistoryOpened] = useState(false);
    const [isItemsOpened, setIsItemOpened] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const result = await get('/deliveries/active');
                result.receiveTime = new Date(result.receiveTime);
                setActiveDelivery(result);
            } catch (error) {
                setActiveDelivery(null)
            }
        })();

    }, [])

    if (activeDelivery === undefined) {
        return <Spinner />
    }

    async function cancelDeliveryHandler() {
        try {
            await del('/deliveries/remove/' + activeDelivery.id);
            setActiveDelivery(null);
        } catch (error) {
            throw error;
        }
    }


    async function deliveredHandler() {
        try {
            await put('/deliveries/change-status/' + activeDelivery.id + '/DELIVERED');
            setActiveDelivery(null);
        } catch (error) {
            throw error;
        }
    }

    return (<>
        <h2>{t('activeDeliveryHeader')}</h2>

        {activeDelivery !== null ? (
            <>
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
                    <span>{activeDelivery.receiveTime.toLocaleString()}</span>
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
                    <span>{activeDelivery.phoneNumber}</span>
                </div>
                <div className="row-wrapper address">
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                {t('addressTooltip')}
                            </Tooltip>
                        }>
                        <img src="/images/city.png" />
                    </OverlayTrigger>
                    <span>{activeDelivery.address}</span>
                </div>
                <div className="row-wrapper">
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                {t('totalPriceLabel')}
                            </Tooltip>
                        }>
                        <img src="/images/price.png" />
                    </OverlayTrigger>
                    <span>{activeDelivery.totalPrice.toFixed(2)} BGN</span>
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
                    <span>{translateStatus(activeDelivery.status)}</span>

                    {activeDelivery.status === 'PENDING' ? (<>
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
                                onClick={cancelDeliveryHandler}
                            />
                        </OverlayTrigger>
                    </>) : null}
                    {activeDelivery.status === 'TRAVELLING' ? (<>
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    {t('deliveredTooltip')}
                                </Tooltip>
                            }>
                            <img
                                type='button'
                                src="/images/yes.png"
                                onClick={cancelDeliveryHandler}
                            />
                        </OverlayTrigger>
                    </>) : null}
                </div>
            </>
        ) : (<>
            <p>
                {t('activeDeliveryEmpty')}
            </p>
        </>)}
        <div className="actions row-wrapper">
            {activeDelivery !== null ? (<>
                <button
                    type='button'
                    className="btn-primary"
                    onClick={() => {
                        setIsItemOpened(true);
                    }}
                >
                    {t('productsHeader')}
                </button>
            </>) : null}
            <button
                type='button'
                className="btn-primary"
                onClick={() => setIsHistoryOpened(true)}
            >
                {t('historyButton')}
            </button>
        </div>

        {isHistoryOpened ? <History setIsHistoryOpened={setIsHistoryOpened} /> : null}
        {isItemsOpened ? <ItemsModal items={activeDelivery.items} opened={setIsItemOpened} /> : null}
    </>);
}