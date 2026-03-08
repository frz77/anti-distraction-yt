chrome.storage.local.get(["isEnabled"], (result) => {
  if (result.isEnabled === false) return; // Если выключено — ничего не делаем

  const quotes = [
    "Stay Focused.",
    "Deep work only.",
    "Don't consume, create.",
    "Is this helping your goal?",
    "Silence the noise.",
    "Distraction is a choice.",
    "Your time is finite.",
    "Focus is a superpower.",
    "Master your attention.",
    "Why are you here?",
    "Discipline equals freedom.",
    "Action > Browsing.",
    "Сфокусируйся на главном.",
    "Твое время — твой актив.",
    "Не потребляй, а создавай.",
    "Дисциплина — это свобода.",
    "Внимание — новая валюта.",
    "Ты здесь за ответом или за дофамином?",
    "Сломай алгоритм.",
    "Будь умнее системы.",
    "Концентрация — твой щит.",
  ];

  // 1. МГНОВЕННЫЙ CSS
  const styleNode = document.createElement("style");
  styleNode.innerHTML = `
    /* Скрываем скелетоны и сетку видео */
    ytd-browse[page-subtype="home"] #contents, 
    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
    #home-page-skeleton, .ytd-ghost-grid-renderer,
    ytd-continuation-item-renderer { 
        display: none !important; 
    }

    /* Полностью убираем левую панель везде */
    #guide, ytd-mini-guide-renderer, app-drawer, #guide-spacer {
        display: none !important;
    }
    
    /* Убираем микрофон */
    #voice-search-button {
        display: none !important;
    }

    /* Убираем отступ слева */
    ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app,
    ytd-app[mini-guide-visible] ytd-page-manager.ytd-app {
        margin-left: 0 !important;
    }

    @keyframes smoothFade { 
        from { opacity: 0; transform: translate(-50%, -45%); } 
        to { opacity: 1; transform: translate(-50%, -50%); } 
    }
`;
  document.documentElement.appendChild(styleNode);

  function getRandomQuote() {
    let usedIndices = JSON.parse(sessionStorage.getItem("usedQuotes") || "[]");
    if (usedIndices.length >= quotes.length) usedIndices = [];
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (usedIndices.includes(randomIndex));
    usedIndices.push(randomIndex);
    sessionStorage.setItem("usedQuotes", JSON.stringify(usedIndices));
    return quotes[randomIndex];
  }

  function applyUltraZen() {
    // 1. Меняем заголовок (безопасно)
    if (document.title !== "AntiDistraction YT")
      document.title = "AntiDistraction YT";

    const isMainPage =
      window.location.pathname === "/" &&
      !window.location.search.includes("search_query");

    // Ищем наш стиль
    let zenStyle = document.getElementById("zen-logic-style");

    // Если стиля нет — создаем
    if (!zenStyle) {
      zenStyle = document.createElement("style");
      zenStyle.id = "zen-logic-style";

      // БЕЗОПАСНАЯ ВСТАВКА: сначала пробуем head, если нет - в корень документа
      const target = document.head || document.documentElement;
      if (target) {
        target.appendChild(zenStyle);
      } else {
        // Если даже корень не найден (фантастика, но бывает), выходим и ждем след. интервала
        return;
      }
    }

    if (isMainPage) {
      zenStyle.innerHTML = `
            ytd-browse[page-subtype="home"], #header, #chips-wrapper, #buttons.ytd-masthead, #end.ytd-masthead { 
                display: none !important; 
            }
            body { overflow: hidden !important; background: var(--yt-spec-general-background-a) !important; }
            
            #masthead-container {
                background: transparent !important;
                position: fixed !important;
                top: 48% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 640px !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                border: none !important;
                animation: smoothFade 0.6s ease-out forwards;
            }

            #center.ytd-masthead { 
                width: 100% !important; 
                margin: 0 !important;
                display: flex !important;
                justify-content: center !important;
            }

            ytd-searchbox.ytd-masthead {
                width: 100% !important;
                max-width: 100% !important;
            }

            #start.ytd-masthead { display: none !important; }
        `;
      showFocusMessage(true);
    } else {
      zenStyle.innerHTML = `
            #secondary, #comments { display: none !important; }
            body { overflow: auto !important; }
        `;
      showFocusMessage(false);
    }
  }

  function showFocusMessage(visible) {
    let msgDiv = document.getElementById("zen-focus-msg");

    if (visible) {
      // Проверяем, есть ли уже тело страницы, куда можно вешать надпись
      if (!document.body) return;

      if (!msgDiv) {
        msgDiv = document.createElement("div");
        msgDiv.id = "zen-focus-msg";
        msgDiv.innerHTML = getRandomQuote();
        Object.assign(msgDiv.style, {
          position: "fixed",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          fontSize: "32px",
          fontWeight: "200",
          color: "var(--yt-spec-text-secondary)",
          fontFamily: '"Roboto", sans-serif',
          textAlign: "center",
          zIndex: "9999",
          pointerEvents: "none",
          letterSpacing: "1px",
          animation: "smoothFade 0.8s ease-out forwards",
        });
        document.body.appendChild(msgDiv); // Теперь это безопасно
      }
    } else if (msgDiv) {
      msgDiv.remove();
    }
  }

  const titleObserver = new MutationObserver(() => {
    if (document.title !== "AntiDistraction YT")
      document.title = "AntiDistraction YT";
  });
  titleObserver.observe(document.documentElement, {
    subtree: true,
    characterData: true,
    childList: true,
  });

  window.addEventListener("yt-navigate-finish", applyUltraZen);
  setInterval(applyUltraZen, 500);
  applyUltraZen();
});