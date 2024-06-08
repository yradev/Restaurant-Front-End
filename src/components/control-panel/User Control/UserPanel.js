import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthenticationContext } from "../../../fragments/Contexts";
import { get, put } from "../../../core/connection";
import { Alert, Form } from "react-bootstrap";

export default function User({ active }) {
    const { t } = useTranslation();
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [staff, setStaff] = useState();
    const [owner, setOwner] = useState();
    const [enabled, setEnabled] = useState();
    const [savedData, setSavedData] = useState();
    const authContext = useContext(AuthenticationContext);

    useEffect(() => {
        if (authContext.email === active) {
            setError(t('cantChangeOwnSettingsError'));
            return;
        } else {
            setError(undefined)
        }

        if (active === undefined) {
            setError(t('notSelectedUserAlert'));
            return
        } else {
            setError(undefined)
        }

        (async () => {
            const data = await get('/user/' + active);
            console.log(data);
            setStaff(data.roles.some(x => x.name === 'ROLE_STAFF'));
            setOwner(data.ownerRole = data.roles.some(x => x.name === 'ROLE_OWNER'));
            setEnabled(data.enabled);
            setUser(data);
            setSavedData(undefined);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, t]);

    function onSubmitHandler(event) {
        event.preventDefault();

        const roles = [];
        if (staff) {
            roles.push({ name: 'ROLE_STAFF' });
        }

        if (owner) {
            roles.push({ name: 'ROLE_OWNER' });
        }

        user.enabled = enabled ? true : false;

        put('/user/edit/' + active, { enabled, roles });
        setSavedData(true)
    }

    return (<>
        {error !== undefined ?
            (<>
                {error}
            </>)
            : (<>
                {savedData !== undefined ? (<>
                    <Alert className="alert">{t('coreSettingsSaved')}</Alert>
                </>) : null}
                <h4>{active}</h4>
                <Form className="column-wrapper" onSubmit={onSubmitHandler}>
                    <div className="action row-wrapper">
                        <Form.Check
                            checked={staff}
                            onChange={() => {
                                setStaff(!staff);
                                setSavedData(undefined);
                            }}
                            type="switch"
                        />
                        <span>{t('staffRoleLabel')}</span>
                    </div>
                    <div className="action row-wrapper">
                        <Form.Check
                            checked={owner}
                            onChange={() => {
                                setOwner(!owner);
                                setSavedData(undefined);
                            }}
                            type="switch"
                        />
                        <span>{t('ownerRoleLabel')}</span>
                    </div>
                    <div className="action row-wrapper">
                        <Form.Check
                            checked={enabled}
                            onChange={() => {
                                setEnabled(!enabled);
                                setSavedData(undefined);
                            }}
                            type="switch"
                        />
                        <span>{t('userStatusEnabled')}</span>
                    </div>

                    <button className="btn-primary" type="submit">{t('submitButton')}</button>
                </Form>
            </>)
        }
    </>)
}