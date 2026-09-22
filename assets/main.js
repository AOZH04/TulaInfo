(function () {
    'use strict';

    var header = document.querySelector('.site_header');

    // Отступ под фиксированную шапку = её реальная высота
    function setHeaderOffset() {
        if (!header) return;
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
    setHeaderOffset();
    window.addEventListener('resize', setHeaderOffset);

    // Бургер-меню
    var burger = document.querySelector('.nav_burger');
    var menu = document.querySelector('.nav_menu');
    function closeSearch() {
        if (searchBar) searchBar.classList.remove('is_open');
    }
    function closeMenu() {
        if (menu) menu.classList.remove('is_open');
        if (burger) {
            burger.classList.remove('is_active');
            burger.setAttribute('aria-expanded', 'false');
        }
    }

    if (burger && menu) {
        burger.addEventListener('click', function () {
            var open = menu.classList.toggle('is_open');
            burger.classList.toggle('is_active', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) closeSearch();
        });
    }

    // Панель поиска
    var searchToggle = document.querySelector('.nav_search_toggle');
    var searchBar = document.querySelector('.search_bar');
    // Фокус инпута на iOS подскролливает страницу и триггерит scroll —
    // это не должно тут же закрывать только что открытый поиск.
    var suppressScrollClose = false;
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function () {
            var open = searchBar.classList.toggle('is_open');
            if (open) {
                closeMenu();
                suppressScrollClose = true;
                setTimeout(function () { suppressScrollClose = false; }, 500);
                var field = searchBar.querySelector('.search_field');
                if (field) field.focus();
            }
        });
    }

    // Мобильный: соцсети -> в меню, поиск и бургер -> в белую строку с лого.
    // Десктоп: всё возвращается на свои места.
    var socials = document.querySelector('.header_socials');
    var headerMeta = socials ? socials.parentNode : null;
    var navInner = document.querySelector('.header_nav_inner');
    var mqMobile = window.matchMedia('(max-width: 850px)');
    function placeControls() {
        if (mqMobile.matches) {
            if (socials && menu && socials.parentNode !== menu) menu.appendChild(socials);
            if (searchToggle && headerMeta && searchToggle.parentNode !== headerMeta) headerMeta.appendChild(searchToggle);
            if (burger && headerMeta && burger.parentNode !== headerMeta) headerMeta.appendChild(burger);
        } else {
            if (socials && headerMeta && socials.parentNode !== headerMeta) headerMeta.appendChild(socials);
            if (burger && navInner && burger.parentNode !== navInner) navInner.insertBefore(burger, navInner.firstChild);
            if (searchToggle && navInner && searchToggle.parentNode !== navInner) navInner.appendChild(searchToggle);
        }
    }
    placeControls();
    setHeaderOffset();
    mqMobile.addEventListener('change', function () {
        placeControls();
        setHeaderOffset();
    });

    // Скролл страницы закрывает открытые поиск и меню
    window.addEventListener('scroll', function () {
        if (searchBar && searchBar.classList.contains('is_open') && !suppressScrollClose) {
            searchBar.classList.remove('is_open');
        }
        if (menu && menu.classList.contains('is_open')) {
            menu.classList.remove('is_open');
            if (burger) {
                burger.classList.remove('is_active');
                burger.setAttribute('aria-expanded', 'false');
            }
        }
    }, { passive: true });

    // Навигация по датам — текущий месяц
    var datesRow = document.querySelector('.dates_row');
    if (datesRow) {
        var dows = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var today = now.getDate();
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        var frag = document.createDocumentFragment();
        var todayEl = null;

        for (var d = 1; d <= daysInMonth; d++) {
            var date = new Date(year, month, d);
            var chip = document.createElement('a');
            chip.href = '#';
            chip.className = 'date_chip' + (d === today ? ' is_today' : '');
            chip.innerHTML =
                '<span class="dow">' + dows[date.getDay()] + '</span>' +
                '<span class="dnum">' + (d < 10 ? '0' + d : d) + '</span>';
            frag.appendChild(chip);
            if (d === today) todayEl = chip;
        }

        datesRow.appendChild(frag);
        if (todayEl) datesRow.scrollLeft = todayEl.offsetLeft - 40;

        // Вертикальное колесо мыши над лентой -> горизонтальный скролл
        datesRow.addEventListener('wheel', function (e) {
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
            if (datesRow.scrollWidth <= datesRow.clientWidth) return;
            e.preventDefault();
            datesRow.scrollLeft += e.deltaY;
        }, { passive: false });
    }
})();
