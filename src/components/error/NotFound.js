import { useContext, useEffect } from "react"
import { NavigationContext } from "../../fragments/Contexts";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const navigationContext = useContext(NavigationContext);
    const { t } = useTranslation();

    useEffect(() => {
        navigationContext.useLargeNavigation('/images/home.jpg');
    }, []);

    return (<h1 className="not-found-page">{t('notFoundPage')}</h1>)
}