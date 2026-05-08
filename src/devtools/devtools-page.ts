interface PanelWindow extends Window {
  __cookieInspectorVisible__?: boolean;
}

chrome.devtools.panels.create(
  chrome.i18n.getMessage('panelTabTitle') || 'Cookies',
  'cookie-icon.png',
  'src/panel/panel.html',
  (panel) => {
    const themeColor = chrome.devtools.panels.themeName;
    let panelWin: PanelWindow | null = null;

    const notify = () => {
      if (!panelWin) return;
      panelWin.dispatchEvent(new CustomEvent('cookie-inspector:visibility'));
    };

    panel.onShown.addListener((panelWindow) => {
      panelWin = panelWindow as PanelWindow;
      panelWin.document.body.classList.add(`${themeColor}Theme`);
      panelWin.__cookieInspectorVisible__ = true;
      notify();
    });

    panel.onHidden.addListener(() => {
      if (!panelWin) return;
      panelWin.__cookieInspectorVisible__ = false;
      notify();
    });
  },
);
