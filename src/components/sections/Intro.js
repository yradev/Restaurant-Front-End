import { faBookReader, faTruck, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Intro() {
    return (
        <div className="section-intro">
            <div className="shell">
                <div className="section__inner">
                    <div className="section__col">
                        <div className="section__head">
                            <FontAwesomeIcon icon={faUtensils} />
                        </div>

                        <div className="section__body">
                            <p>Favorite dishes</p>
                        </div>
                    </div>

                    <div className="section__col">
                        <div className="section__head">
                            <FontAwesomeIcon icon={faTruck} />
                        </div>

                        <div className="section__body">
                            <p>Home Deliveries</p>
                        </div>
                    </div>

                    <div className="section__col">
                        <div className="section__head">
                            <FontAwesomeIcon icon={faBookReader} />
                        </div>

                        <div className="section__body">
                            <p>Reservations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}