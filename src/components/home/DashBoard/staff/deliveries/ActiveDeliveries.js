import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { del, get, put } from "../../../../../core/connection";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import Pagination from "../../../../../fragments/Pagination";
import History from "./History";
import { translateStatus } from "../../../../../core/languages";
import ItemsModal from "../../../../../fragments/ItemsModal";

export default function ActiveDeliveries() {
    const [isItemsOpened, setIsItemOpened] = useState(false);
    const { t } = useTranslation();

    const [deliveries, setDeliveries] = useState();
    const [page, setPage] = useState(0);
    const [isHistoryOpened, setIsHistoryOpened] = useState(false);
    const [items, setItems] = useState();


    const [updater, setUpdater] = useState({
        counter: 0,
        update() {
            this.counter += 1;
            setUpdater({ ...this })
        }
    });

    useEffect(() => {
        (async () => {
            const result = await get('/deliveries/staff/active');

            const splitBy10 = [];

            result.forEach(a => {
                a.receiveTime = new Date(a.receiveTime);
            })

            for (let index = 0; index < result.length; index += 10) {
                splitBy10.push(result
                    .slice(index, index + 10))
            }
            setDeliveries(splitBy10);
        })()
    }, [t, updater]);

    if (deliveries === undefined) {
        return <Spinner />;
    }


    async function acceptHandler(id) {
        await put('/deliveries/staff/change-status/' + id + '/ACCEPTED');
        updater.update();
    }

    async function travellHandler(id) {
        await put('/deliveries/staff/change-status/' + id + '/TRAVELLING');
        updater.update();
    }

    async function deliveredHandler(id) {
        await put('/deliveries/staff/change-status/' + id + '/DELIVERED');
        updater.update();
    }

    async function canceledHandler(id) {
        await put('/deliveries/staff/change-status/' + id + '/CANCELED');
        updater.update();
    }

    return (<>
        <h2>{t('activeDeliveriesHeader')}</h2>
        {deliveries.length === 0 ?
            <p>{t('activeDeliveriessEmpty')}</p>
            : (<>
                <div className="row-wrapper staff-active-deliveries">
                    <span>{t('HourLabel')}</span>
                    <span>{t('totalPriceLabel')}</span>
                    <span>{t('statusLabel')}</span>
                    <span>{t('detailsLabel')}</span>
                </div>
                {deliveries[page].map(delivery => (
                    <div className="row-wrapper staff-active-deliveries">
                        <span>{delivery.receiveTime.toLocaleString()}</span>
                        <span>{delivery.totalPrice.toFixed(2)} BGN</span>
                        <div className="row-wrapper">
                            <span>{translateStatus(delivery.status)}</span>
                            {delivery.status === 'PENDING' ? (<>
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
                                        onClick={() => acceptHandler(delivery.id)}
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
                                        onClick={() => canceledHandler(delivery.id)}
                                    />
                                </OverlayTrigger>
                            </>) : null}
                            {delivery.status === 'ACCEPTED' ? (<>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {t('travelTooltip')}
                                        </Tooltip>
                                    }>

                                    <img
                                        type='button'
                                        src="/images/travelling.png"
                                        onClick={() => travellHandler(delivery.id)}
                                    />
                                </OverlayTrigger>
                            </>) : null}
                            {delivery.status === 'TRAVELLING' ? (<>
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
                                        onClick={() => deliveredHandler(delivery.id)}
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
                                        onClick={() => canceledHandler(delivery.id)}
                                    />
                                </OverlayTrigger>
                            </>) : null}
                        </div>

                        <div className="row-wrapper details">
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {t('itemsTooltip')}
                                    </Tooltip>
                                }>
                                <img
                                    type='button'
                                    src="/images/items.png"
                                    onClick={() => {
                                        setItems(delivery.items);
                                        setIsItemOpened(true);
                                    }}
                                ></img>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {delivery.address}
                                    </Tooltip>
                                }>
                                <img src="/images/house.png"></img>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {delivery.phoneNumber}
                                    </Tooltip>
                                }>
                                <img src="/images/phone.png"></img>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip>
                                        {delivery.username}
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
            {deliveries.length === 0 ? null : (<>
                <Pagination
                    items={deliveries}
                    page={page}
                    setPage={setPage}
                />
            </>)}
            <button
                type='button'
                className="btn-primary"
                onClick={() => { setIsHistoryOpened(true) }}
            >
                {t('historyButton')}
            </button>
        </div>
        {isHistoryOpened ? <History setIsHistoryOpened={setIsHistoryOpened} /> : null}
        {isItemsOpened ? <ItemsModal items={items} opened={setIsItemOpened} /> : null}
    </>);
}