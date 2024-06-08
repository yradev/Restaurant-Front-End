import { Form } from "react-bootstrap";
import LargeNavigation from "../navigation/LargeNavigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthenticationContext, ModalsContext, NavigationContext } from "../../fragments/Contexts";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../core/connection";

export default function Reservation() {
    const [guests, setGuests] = useState('');
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [phone, setPhone] = useState('');
    const authentication = useContext(AuthenticationContext);
    const modalsControl = useContext(ModalsContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const navigationContext = useContext(NavigationContext);

    useEffect(() => {
        navigationContext.useLargeNavigation('/images/reservation.png')
    }, []);

    useEffect(() => {
        if (authentication.isLogged) {
            (async () => {
                try {
                    const result = await get('/reservations/active');
                    if (result !== undefined) {
                        navigate('/')
                    }
                } catch (error) {
                }
            })()
        }
    }, [navigate, authentication])


    async function handleSubmit(event) {
        event.preventDefault();
        if (!authentication.isLogged) {
            modalsControl.updateLogin(true);
        } else {
            const body = {
                'reservationFor': date + 'T' + time,
                'countOfGuests': guests,
                'phoneNumber': phone
            };

            try {
                await post('/reservations/add', body);
                navigate('/panel/user')
            } catch (error) {
                throw error;
            }
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'guests': setGuests(value); break;
            case 'time': setTime(value); break;
            case 'date': setDate(value); break;
            case 'phone': setPhone(value); break;
            default: new Error();
        }
    }


    function currentDate() {
        const tempDate = new Date();
        const year = tempDate.getFullYear();
        tempDate.setMonth(tempDate.getMonth() + 1);
        const month = tempDate.getMonth() > 9 ? tempDate.getMonth() : '0' + tempDate.getMonth();
        const day = tempDate.getDate() > 9 ? tempDate.getDate() : '0' + tempDate.getDate();
        return year + '-' + month + '-' + day;
    }

    function currentTime() {
        if (date === currentDate()) {
            const tempDate = new Date();
            return tempDate.getHours() + ':' + tempDate.getMinutes();
        }
    }

    return <>
        <div className="column-wrapper reservation-body">
            <Form onSubmit={handleSubmit}>
                <h1 className="mb-4" style={{ textAlign: 'center' }}>{t('reservationHeader')}</h1>
                <Form.Control
                    type="number"
                    name="guests"
                    required
                    min='1'
                    value={guests}
                    onChange={onChangeHandler}
                    placeholder={t('guestsPlaceHolder')}
                />
                <Form.Control
                    type="time"
                    name="time"
                    required
                    min={currentTime()}
                    value={time}
                    onChange={onChangeHandler}
                    placeholder={t('reservationForPlaceHolder')}
                />
                <Form.Control
                    type="date"
                    name="date"
                    min={currentDate()}
                    required
                    value={date}
                    onChange={onChangeHandler}
                    placeholder={t('dateOfReservationPlaceHolder')}
                />
                <Form.Control
                    type="number"
                    name="phone"
                    required
                    value={phone}
                    onChange={onChangeHandler}
                    placeholder={t('phoneForContactsHolder')}
                />
                <button type="submit" className="btn-primary mt-4">{t('findTableButton')}</button>
            </Form>
        </div >
    </>;
}