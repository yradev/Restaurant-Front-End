import { faCaretDown, faCartShopping, faGlobe, faLanguage, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getLanguage } from "../../core/storage";
import getLanguages from "../../core/languages";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import i18next from "i18next";

export default function Header() {
	const [headerVisible, setHeaderVisible] = useState(true);
	const [dropdownFavoritesOpen, setDropdownFavoritesOpen] = useState(false);
	const [dropdownBagOpen, setDropdownBagOpen] = useState(false);
	const [dropdownLanguagesOpen, setDropdownLanguagesOpen] = useState(false);
	const [language, setLanguage] = useState(getLanguages().find(a => a.code === getLanguage()));
	let timer;
	let oldScrollPosition = 0;
	const { t } = useTranslation();

	useEffect(() => {
		function handleScroll() {
			const currPosition = window.scrollY;

			if (currPosition > 400) {
				if (currPosition < oldScrollPosition) {
					setHeaderVisible(true);
				} else {
					setHeaderVisible(false)
				}
			} else {
				setHeaderVisible(true);
			}

			oldScrollPosition = currPosition;
		}

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [])

	useEffect(() => {

	}, [])

	/**
	 * Clear timeout
	 */

	function clearTimeoutHandler() {
		clearTimeout(timer);
	}

	/* 
	Drop down open handler
	*/

	function onDropdownEnterHandler(dropdownStatus) {
		timer = setTimeout(() => {
			dropdownStatus(true);
		}, [500])
	}

	/* 
	Drop down close handler
	*/

	function onDropdownLeaveHandler(dropdownStatus) {
		clearTimeout(timer);

		timer = setTimeout(() => {
			dropdownStatus(false);
		}, [500])
	}

	return (
		<header className={`header ${!headerVisible ? 'is-hidden' : ''}`}>
			<div class="shell shell--fluid">
				<div class="header__inner">
					<div className={`header__language ${dropdownLanguagesOpen ? 'is-active' : ''}`}>
						<a
							href="#"
							onMouseEnter={() => onDropdownEnterHandler(setDropdownLanguagesOpen)}
							onMouseLeave={() => onDropdownLeaveHandler(setDropdownLanguagesOpen)}
						>
							<FontAwesomeIcon icon={faGlobe} />
						</a>

						<div
							className="dropdown"
							onMouseEnter={clearTimeoutHandler}
							onMouseLeave={() => onDropdownLeaveHandler(setDropdownLanguagesOpen)}>
							<p>We dont have favorites yet.</p>
						</div>
					</div>

					<a href="#" class="logo">
						<img src="assets/images/logo.png" alt="Not Found" />
					</a>

					<div class="nav-trigger">
						<span></span>

						<span></span>

						<span></span>
					</div>

					<div class="header__nav">
						<nav class="nav">
							<ul>
								<li>
									<a href="#">Начало</a>
								</li>

								<li>
									<a href="#">Меню</a>
								</li>

								<li>
									<a href="#">Резервация</a>
								</li>

								<li>
									<a href="#">Контакти</a>
								</li>
							</ul>
						</nav>

						<nav class="nav-utilities">
							<ul>
								<li className={dropdownFavoritesOpen ? 'is-active' : ''}>
									<a
										href="#"
										onMouseEnter={() => onDropdownEnterHandler(setDropdownFavoritesOpen)}
										onMouseLeave={() => onDropdownLeaveHandler(setDropdownFavoritesOpen)}
									>
										<FontAwesomeIcon icon={faStar} />

										Любими

										<FontAwesomeIcon icon={faCaretDown} className="nav__dropdown-icon" />
									</a>

									<div
										className="dropdown"
										onMouseEnter={clearTimeoutHandler}
										onMouseLeave={() => onDropdownLeaveHandler(setDropdownFavoritesOpen)}>

										{getLanguages().map((value, index) => {
											if (value.name !== language.name) {
												return <div key={index}>
													<a className="btn-with-icon" onClick={() => {
														i18next.changeLanguage((value.code))
														setLanguage(value)
													}}>
														<Flag code={value.flagCode} /> {value.name}
													</a>
												</div>
											} else {
												return null;
											}
										})}
									</div>
								</li>

								<li className={dropdownBagOpen ? 'is-active' : ''}>
									<a
										href="#"
										onMouseEnter={() => onDropdownEnterHandler(setDropdownBagOpen)}
										onMouseLeave={() => onDropdownLeaveHandler(setDropdownBagOpen)}
									>
										<FontAwesomeIcon icon={faCartShopping} />

										Кошница

										<FontAwesomeIcon icon={faCaretDown} className="nav__dropdown-icon" />
									</a>

									<div
										className="dropdown dropdown--left"
										onMouseEnter={clearTimeoutHandler}
										onMouseLeave={() => onDropdownLeaveHandler(setDropdownBagOpen)}>
										<p>We dont have favorites yet.</p>
									</div>
								</li>

								<li>
									<a href="#">Вход</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}