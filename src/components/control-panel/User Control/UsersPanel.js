import { useEffect, useState } from "react"
import { get } from "../../../core/connection"
import { useTranslation } from "react-i18next";

export default function Users({ active }) {
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            if (search.length === 0) {
                const data = await get('/user/filter/all')
                setUsers(data);
            } else {
                const data = await get('/user/filter/' + search)
                setUsers(data);
            }
        })()
    }, [search])

    if (users === undefined) {
        return;
    }

    function onChangeHandler(event) {
        setSearch(event.target.value);
        setEmail(undefined);
        active(undefined)
    }

    function activeHandler(email) {
        setEmail(email);
        active(email);
    }

    return (<>
        <div className="search">
            <input
                type="text"
                className="btn-primary"
                placeholder={t('searchUsersPlaceHolder')}
                onChange={onChangeHandler} />
            <img
                alt='Not Found'
                src="/images/search.png" />
        </div>
        <div className="users column-wrapper">
            {users.map(user => (<>
                <div
                    className={
                        email === user.email
                            ?
                            'user row-wrapper active'
                            :
                            'user row-wrapper'
                    }
                    type='button'
                    onClick={() => activeHandler(user.email)}>
                    <span>{user.email}</span>
                    <img
                        alt='Not Found'
                        src="/images/click.png"
                    />
                </div>
            </>))}
        </div>
    </>)
}