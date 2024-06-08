import { useContext, useEffect } from "react";
import { NavigationContext } from "../../fragments/Contexts";
import { useTranslation } from "react-i18next";

export default function ControlPanel() {
    const navigationContext = useContext(NavigationContext);
    const { t } = useTranslation();

    useEffect(() => {
        navigationContext.useControlPanelNavigation();
    }, []);

    return (<>
        <div className="column-wrapper control-panel-welcome fade-in">
            <h2>{t('cpIntro')}</h2>
            <h5>{t('cpSubIntro')}</h5>
        </div>
    </>)
}