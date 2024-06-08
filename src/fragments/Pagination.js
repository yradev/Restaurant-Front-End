import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function Pagination({ items, page, setPage }) {
    const { t } = useTranslation();
    const paginations = [];

    for (let i = 1; i <= items.length; i++) {
        paginations.push(i);
    }

    return (<>
        <div className="pagination row-wrapper">
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        {t('previousTooltip')}
                    </Tooltip>
                }>
                <img
                    type='button'
                    src="/images/left-pagination.png"
                    onClick={() => {
                        if (page > 0) {
                            setPage(page - 1);
                        }
                    }}
                />
            </OverlayTrigger>

            {paginations.map(currentPage => (<>
                <button
                    className={currentPage === page + 1 ? 'current-page' : 'page'}
                    onClick={() => {
                        if (currentPage !== page + 1) {
                            setPage(currentPage - 1);
                        }
                    }}
                >{currentPage}</button>
            </>))}

            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        {t('nextTooltip')}
                    </Tooltip>
                }>
                <img
                    type='button'
                    src="/images/right-pagination.png"
                    onClick={() => {
                        if (page < items.length - 1) {
                            setPage(page + 1);
                        }
                    }}
                />
            </OverlayTrigger>
        </div>
    </>);
}