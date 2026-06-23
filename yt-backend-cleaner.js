/// yt-backend-cleaner.js
(function() {
    'use strict';

    const noop = () => {};
    
    // Безопасный прокси для бесконечных чейн-вызовов (obj.func().func2())
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
        if (!window.g) window.g = {};
        
        // Глушим точку входа VAST-событий Goog_AdSense_Lidar
        window.g.lP = noop;

        // Перехватываем функцию g.hc (регистратор глобальных API)
        // Если YouTube пытается зарегистрировать Lidar или IMA, мы подсовываем пустышку
        const originalHc = window.g.hc;
        window.g.hc = function(name, callback) {
            if (name && (name.includes('Lidar') || name.includes('ima.') || name.includes('ytads'))) {
                return originalHc ? originalHc.call(window.g, name, () => safeProxy) : safeProxy;
            }
            return originalHc ? originalHc.apply(this, arguments) : callback;
        };
    };

    // ==========================================
    // 2. ОБМАН ANTI-ADBLOCK (Пункт 8)
    // ==========================================
    const bypassAntiAdblock = () => {
        // Симулируем успешную загрузку ad_status.js с doubleclick.net
        if (window.Cyu) window.Cyu = () => Promise.resolve();
        if (window.eE) window.eE = () => "ALLOWED"; // Говорим, что блокировщик не обнаружен
        window.q6 = true; // Выставляем флаг успешного завершения проверки
        window.DCLKSTAT = 1; 
    };

    // ==========================================
    // 3. ПОЛНАЯ СЛЕПОТА ТРЕКЕРОВ (Viewability / IntersectionObserver)
    // ==========================================
    const blindViewability = () => {
        // Ослепляем классы отслеживания видимости
        if (window.vt) window.vt = safeProxy;
        if (window.or) window.or = () => safeProxy;
        
        if (window.Zoo) {
            window.Zoo = class { 
                constructor() { this.LT = () => safeProxy; this.Wb = {}; this.dW = noop; } 
            };
        }
        if (window.FDL) window.FDL = class { constructor() { this.g1 = 0; this.hg = false; } };

        // Перехватываем нативный IntersectionObserver, чтобы он думал, что реклама ВСЕГДА скрыта (0% видимости)
        const OriginalObserver = window.IntersectionObserver;
        window.IntersectionObserver = class extends OriginalObserver {
            constructor(callback, options) {
                super((entries, observer) => {
                    // Модифицируем записи: делаем их невидимыми, чтобы триггеры показов рекламы не срабатывали
                    const mockedEntries = entries.map(entry => Object.create(entry, {
                        isIntersecting: { value: false },
                        intersectionRatio: { value: 0 }
                    }));
                    callback(mockedEntries, observer);
                }, options);
            }
        };
    };

    // ==========================================
    // 4. МГНОВЕННЫЙ ПРОПУСК СЛОТОВ И ОТВЕТОВ
    // ==========================================
    const fastPassAdsFlow = () => {
        // Имитируем, что сервер прислал 0 рекламных блоков
        if (window.Ody) window.Ody = () => [];
        if (window.Cx) window.Cx = () => [];
        if (window.aZA) window.aZA = () => true;

        // Отключаем клик-трекеры ytp-ad-has-logging-urls
        if (window.rFy) window.rFy = class { constructor() { this.logVisibility = noop; this.logClick = noop; } };
        if (window.Q7e) window.Q7e = noop;

        // Жизненный цикл рекламы: говорим плееру, что реклама УЖЕ закончилась
        if (window.h5) {
            window.h5 = class {
                constructor() { this.scheduled = false; }
                Au() { return Promise.resolve(); } // Мгновенный триггер на выход из слота
            };
        }

        // Заглушки для функций управления потоком плеера
        const instantResolve = () => Promise.resolve({ status: 'success' });
        window.M5x = instantResolve;
        window.nCp = instantResolve;
        window.qXi = instantResolve;
        window.BX = instantResolve;
    };

    // ==========================================
    // 5. ПОДАВЛЕНИЕ СЕТЕВЫХ ПИНГОВ (Image / sendBeacon / Fetch)
    // ==========================================
    const muteNetworkPings = () => {
        // Блокируем g.ES (отправка пингов через Image/sendBeacon)
        if (window.g) {
            window.g.ES = () => true; // Возвращаем true, типа отправлено успешно
            if (window.g.yJ) window.g.yJ = noop;
            if (window.g.vA) window.g.vA = () => Promise.resolve({});
            if (window.g.mh) window.g.mh = () => ({}); 
        }

        if (window.RFe) window.RFe = async () => ({ status: 'success', skipped: true });
        if (window.LLe) window.LLe = () => Promise.resolve({});

        // Отключаем офлайн-логирование в IndexedDB
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
    // ТОЧКА ИНИЦИАЛИЗАЦИИ
    // ==========================================
    const init = () => {
        defuseGlobalAPI();
        bypassAntiAdblock();
        blindViewability();
        fastPassAdsFlow();
        muteNetworkPings();
    };

    // Запуск на опережение
    init();
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('load', init);

    console.log('uBO Inject: YouTube Backend Cleaner Active (V2 - Ultra Fast, Anti-Adblock Bypassed)');
})();
