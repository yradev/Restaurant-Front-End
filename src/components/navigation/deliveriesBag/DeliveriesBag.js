import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getDeliveriesBagActions } from "../../../core/storage";
import { get } from "../../../core/connection";
import { ItemsPanelContext } from "../../../fragments/Contexts";
import NewDelivery from "../../menu/NewDelivery";

export default function DeliveriesBag({ setDeliveriesBagDropdown }) {
    const [deliveriesBag, setItems] = useState();
    const itemsContext = useContext(ItemsPanelContext);

    const [hovered, setHover] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [newDeliveryModalOpened, setNewDeliveryModalOpened] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const deliveriesBagData = itemsContext.deliveriesBag;

        (async () => {
            let total = 0;
            const result = await Promise.all(deliveriesBagData.map(
                async (i) => {
                    const tempItem = await get(`/items/${i.id}`);
                    tempItem.count = i.count;
                    tempItem.total = i.count * tempItem.price;
                    total += tempItem.total;
                    return tempItem;
                }));

            setTotalPrice(total);
            setItems(result);
        })()
    }, [itemsContext]);


    if (deliveriesBag === undefined) {
        return <Spinner />
    }

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

    function clearHandler() {
        getDeliveriesBagActions().clear();
        itemsContext.updateDeliveriesBag();
    }

    return (
        <div className="column-wrapper items-panel-body">
            {deliveriesBag.length > 0 ?
                <>
                    <div className="items" style={{ height: 140 }}>
                        {deliveriesBag.map(item => (
                            <div
                                className="item"
                                key={deliveriesBag.indexOf(item)}
                                onMouseEnter={() => setHover({ categoryPosition: item.categoryPosition, itemPosition: item.itemPosition })}
                                onMouseLeave={() => setHover(null)}>

                                <img src={item.imageUrl} className="logo" />
                                <div className="details">
                                    <span>{item.categoryName}</span>
                                    <span>{item.itemName}</span>
                                    <span>{item.count} {t('countTranslation')}.</span>
                                    <div className="price">{item.total.toFixed(2)} BGN
                                        {
                                            hovered !== null &&
                                                hovered.categoryPosition === item.categoryPosition &&
                                                hovered.itemPosition === item.itemPosition
                                                ? <>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                {t('addOneTooltip')}
                                                            </Tooltip>
                                                        }>
                                                        <img src='/images/plus.png' type='button' onClick={() => {
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
                                                </>
                                                :
                                                null}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="total-price">
                        {t('totalPriceAlert')} {totalPrice.toFixed(2)} BGN
                    </div>
                    <div className="actions">
                        <button
                            className="btn-primary clear-favorites" onClick={clearHandler}>
                            {t('clearButton')}
                        </button>
                        <button
                            className="btn-secondary clear-favorites" onClick={() => {
                                setDeliveriesBagDropdown(false);
                                setNewDeliveryModalOpened(true);
                            }
                            }>
                            {t('continueButton')}
                        </button>
                    </div>
                </>
                :
                <p className="empty">{t('deliveriesBagEmpty')}</p>
            }

            {newDeliveryModalOpened ? (
                <NewDelivery opened={setNewDeliveryModalOpened} items={deliveriesBag} totalPrice={totalPrice} />
            ) : null}
        </div>
    )
}
