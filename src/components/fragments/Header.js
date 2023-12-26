export default function Header({ headerTransperant }) {
	return (
		<header className={`header ${headerTransperant ? 'header--transperant' : ''}`}>
			<div class="shell">
				<div class="header__inner">
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
									<a href="#">За Нас</a>
								</li>
							</ul>
						</nav>

						<nav class="nav-utilities">
							<ul>
								<li>
									<span>Вход</span>
								</li>

								<li>
									<span>Регистрация</span>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}