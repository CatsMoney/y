// yt-adblock-inject.js
(function() {
    'use strict';

    // ==========================================
    // УТИЛИТЫ
    // ==========================================
    const noop = () => {};
    const safeProxy = new Proxy({}, {
        get: (target, prop) => {
            if (prop === 'then') return undefined;
            return () => safeProxy;
        }
    });

    // ==========================================
    // 1. НЕЙТРАЛИЗАЦИЯ РЕКЛАМНЫХ API (Lidar / IMA)
    // ==========================================
    const defuseGlobalAPI = () => {
        window.g = window.g || {};
        window.g.lP = noop;

        const originalHc = window.g.hc;
        window.g.hc = function(name, callback) {
            if (name && (name.includes('Lidar') || name.includes('ima.') || name.includes('ytads'))) {
                return typeof originalHc === 'function'
                    ? originalHc.call(window.g, name, () => safeProxy)
                    : safeProxy;
            }
            return typeof originalHc === 'function'
                ? originalHc.apply(this, arguments)
                : callback;
        };

        // Дополнительно: глушим google.ima
        window.google = window.google || {};
        window.google.ima = safeProxy;
    };

    // ==========================================
    // 2. ОБХОД ANTI-ADBLOCK
    // ==========================================
    const bypassAntiAdblock = () => {
        if (window.Cyu) window.Cyu = () => Promise.resolve();
        if (window.eE) window.eE = () => "ALLOWED";
        window.q6 = true;
        window.DCLKSTAT = 1;
    };

    // ==========================================
    // 3. БЛОКИРОВКА ОТСЛЕЖИВАНИЯ ВИДИМОСТИ
    // ==========================================
    const blindViewability = () => {
        if (window.vt) window.vt = safeProxy;
        if (window.or) window.or = () => safeProxy;

        if (window.Zoo) {
            window.Zoo = class {
                constructor() {
                    this.LT = () => safeProxy;
                    this.Wb = {};
                    this.dW = noop;
                }
            };
        }

        if (window.FDL) {
            window.FDL = class {
                constructor() { this.g1 = 0; this.hg = false; }
            };
        }

        // Перехват IntersectionObserver для обнуления видимости рекламы
        const OriginalObserver = window.IntersectionObserver;
        if (OriginalObserver) {
            window.IntersectionObserver = class extends OriginalObserver {
                constructor(callback, options) {
                    super((entries, observer) => {
                        const mockedEntries = entries.map(entry =>
                            Object.create(entry, {
                                isIntersecting: { value: false },
                                intersectionRatio: { value: 0 }
                            })
                        );
                        callback(mockedEntries, observer);
                    }, options);
                }
            };
        }
    };

    // ==========================================
    // 4. МГНОВЕННЫЙ ПРОПУСК РЕКЛАМНЫХ СЛОТОВ
    // ==========================================
    const fastPassAdsFlow = () => {
        if (window.Ody) window.Ody = () => [];
        if (window.Cx) window.Cx = () => [];
        if (window.aZA) window.aZA = () => true;

        if (window.rFy) {
            window.rFy = class {
                constructor() {
                    this.logVisibility = noop;
                    this.logClick = noop;
                }
            };
        }

        if (window.Q7e) window.Q7e = noop;

        if (window.h5) {
            window.h5 = class {
                constructor() { this.scheduled = false; }
                Au() { return Promise.resolve(); }
            };
        }

        const instantResolve = () => Promise.resolve({ status: 'success' });
        window.M5x = instantResolve;
        window.nCp = instantResolve;
        window.qXi = instantResolve;
        window.BX = instantResolve;
    };

    // ==========================================
    // 5. ПОДАВЛЕНИЕ СЕТЕВЫХ ПИНГОВ
    // ==========================================
    const muteNetworkPings = () => {
        if (window.g) {
            window.g.ES = () => true;
            if (window.g.yJ) window.g.yJ = noop;
            if (window.g.vA) window.g.vA = () => Promise.resolve({});
            if (window.g.mh) window.g.mh = () => ({});
        }

        if (window.RFe) window.RFe = async () => ({ status: 'success', skipped: true });
        if (window.LLe) window.LLe = () => Promise.resolve({});

        window.ayH = safeProxy;

        if (window.ui6) {
            window.ui6 = class {
                writeThenSend() { return Promise.resolve(); }
                sendThenWrite() { return Promise.resolve(); }
                sendAndWrite() { return Promise.resolve(); }
            };
        }
    };

    // ==========================================
    // 6. ПРИНУДИТЕЛЬНЫЙ ВЫХОД ИЗ РЕКЛАМЫ (CSS + DOM)
    // ==========================================
    const forceVideoMode = () => {
        try {
            const player = document.querySelector('#movie_player');
            if (!player || typeof player.stopVideo !== 'function') return;

            // Метод 1: программный выход
            if (typeof player.isAdShowing === 'function' && player.isAdShowing()) {
                player.stopVideo();
                player.playVideo();
            }

            // Метод 2: клик по кнопке пропуска, если она есть
            const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button');
            if (skipBtn) {
                skipBtn.click();
            }

            // Метод 3: закрытие баннерной рекламы
            const closeBtn = document.querySelector('.ytp-ad-overlay-close-button');
            if (closeBtn) {
                closeBtn.click();
            }
        } catch (e) {
            // Игнорируем ошибки, если плеер ещё не готов
        }
    };

    // ==========================================
    // 7. CSS-БЛОКИРОВКА ВИЗУАЛЬНЫХ ЭЛЕМЕНТОВ
    // ==========================================
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .ad-showing,
            .ad-interrupting,
            .ytp-ad-module,
            .ytp-ad-player-overlay,
            .ytp-ad-player-overlay-layout,
            .ytp-ad-image-overlay,
            .ytp-ad-text-overlay,
            .video-ads,
            .ytp-ad-progress-list,
            #player-ads,
            #masthead-ad,
            #offer-module,
            ytd-display-ad-renderer,
            ytd-companion-slot-renderer,
            ytd-action-companion-ad-renderer,
            ytd-video-masthead-ad-advertiser-info-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-ad-slot-renderer,
            .ytd-display-ad-renderer,
            .ytd-companion-slot-renderer,
            .ytd-action-companion-ad-renderer,
            .ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                pointer-events: none !important;
                position: absolute !important;
                z-index: -9999 !important;
            }

            /* Скрываем серый фон заставки рекламы */
            .ytp-preview-ad {
                display: none !important;
            }

            /* Убираем информационные панели о рекламе */
            .ytp-ad-info-dialog,
            .ytp-ad-info-hover-text-button {
                display: none !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    };

    // ==========================================
    // 8. МОНИТОРИНГ DOM И СБРОС ТАЙМЕРОВ
    // ==========================================
    const startMonitoring = () => {
        // MutationObserver для динамически подгружаемых рекламных элементов
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    forceVideoMode();
                    break;
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Периодическая проверка (страховка от пропущенных случаев)
        setInterval(forceVideoMode, 500);
    };

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ
    // ==========================================
    const init = () => {
        try {
            defuseGlobalAPI();
            bypassAntiAdblock();
            blindViewability();
            fastPassAdsFlow();
            muteNetworkPings();
            injectStyles();
            startMonitoring();
            forceVideoMode(); // Немедленная попытка выхода из рекламы

            console.debug('[YT-AdBlock] Initialized successfully');
        } catch (e) {
            console.error('[YT-AdBlock] Initialization error:', e);
        }
    };

    // Запуск на всех этапах загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // Дополнительный запуск после полной загрузки (ловим отложенные скрипты)
    window.addEventListener('load', init, { once: true });

})();
