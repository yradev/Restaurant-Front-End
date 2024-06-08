import { useContext, useState } from "react";
import { useEffect } from "react";
import { NavigationContext } from "../../../fragments/Contexts";
import { useTranslation } from "react-i18next";
import Users from "./UsersPanel";
import User from "./UserPanel";

export default function UserControl() {
    const [email, setEmail] = useState();
    const navigationContext = useContext(NavigationContext);
    const { t } = useTranslation();

    useEffect(() => {
        navigationContext.useControlPanelNavigation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<>
        <div className="user-control row-wrapper fade-in">
            <div className="field column-wrapper">
                <h2>{t('usersLabel')}</h2>
                <Users active={setEmail} />
            </div>
            <div className="user field column-wrapper">
                <User active={email} />
            </div>
        </div>
    </>);
}