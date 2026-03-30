import { css } from 'lit';

export const cardStyles = css`
  :host { display: block; }
  ha-card { padding: 4px 12px 12px 12px; background: #1c1c1c; color: white; overflow: hidden; }
  .card-header { display: flex; justify-content: space-between; margin-top: -12px; margin-bottom: -2px; height: 32px; align-items: center;  }
  .reason-badge { border: 1px solid #333; padding: 1px 8px; border-radius: 12px; color: #bbb; font-size: 11px; }
  .status-badge { border: 1px solid #03a9f4; color: #03a9f4; padding: 1px 8px; border-radius: 12px; font-weight: bold; font-size: 10px; }
  
  /* Dodatkowa klasa dla statusu ładującego */
  .status-badge.charging-status { border-color: #4caf50; color: #4caf50; background: rgba(76, 175, 80, 0.1); }

  .top-controls-grid { display: flex; gap: 8px; margin-top: -10px; margin-bottom: 8px; }
  .modes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; flex: 1; }
  .actions-grid { display: flex; flex-direction: column; gap: 4px; width: 80px; }

  /* --- BAZA PRZYCISKU --- */
  .mode-btn { background: #262626; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2px; cursor: pointer; height: 44px; border: 1px solid transparent; transition: background 0.2s, border-color 0.2s; }  
  .mode-btn.active { border-color: #03a9f4; background: rgba(3,169,244,0.1); border-width: 1px; border-style: solid; }
  .mode-btn ha-icon { --mdc-icon-size: 20px; }
  .mode-btn span { font-size: 10px; }

  .action-btn { height: 20px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-top: 0px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .force { background: #ff9800; color: black; }
  .start { background: #4caf50; color: black; }
  .stop { background: #f44336; color: white; }

  /* --- STYLE PODSTAWOWE (Stałe kolory) --- */
  .mode-btn.standard { color: #ff9800 !important; }
  .mode-btn.standard ha-icon { color: #ff9800 !important; }
  .mode-btn.eco { color: #4caf50 !important; }
  .mode-btn.eco ha-icon { color: #4caf50 !important; }
  .mode-btn.next-trip { color: #03a9f4 !important; }
  .mode-btn.next-trip ha-icon { color: #03a9f4 !important; }
  
  /* --- STYLE AKTYWNE (Obramowanie i tło) --- */
  .mode-btn.active.standard { border: 1px solid #ff9800 !important; background: rgba(255, 152, 0, 0.1) !important; }
  .mode-btn.active.eco { border: 1px solid #4caf50 !important; background: rgba(76, 175, 80, 0.1) !important; }
  .mode-btn.active.next-trip { border: 1px solid #03a9f4 !important; background: rgba(3, 169, 244, 0.1) !important; }
  

  /* ŚRODEK */
  .visual-center { display: flex; justify-content: space-between; align-items: center; height: 110px; margin-top: 18px; }
  .device-img { width: 71px; z-index: 2; position: relative; }
  #led-ring { position: absolute; width: 100%; height: 100%; top: 77px; left: 48px; z-index: 3; pointer-events: none; }

  .side-column { display: flex; flex-direction: column; gap: 4px; width: 85px; margin-top: -12px; }
  .data-row { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #ccc; white-space: nowrap; }
  .data-row.right { justify-content: flex-end; text-align: right; }
  .data-row ha-icon { --mdc-icon-size: 16px; color: #03a9f4; }
  
  .device-container { position: relative; width: 71px; margin: 0 auto; display: flex; justify-content: center; }
  
  .soc-range-row { display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-top: 2px; margin-bottom: 4px; }
  .stat-item { display: flex; align-items: center; gap: 4px; }
  .stat-item ha-icon { --mdc-icon-size: 14px; transition: color 0.3s ease; }
 
  .time-left-text { text-align: center; font-size: 11px; color: #03a9f4; margin-top: 4px; font-weight: 500; }

  .settings-area select { width: 100%; max-width: 150px; font-size: 11px; padding: 2px; }
  .settings-header { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #555; }
  .header-icons { display: flex; gap: 12px; color: #888; }
  .header-icons ha-icon { cursor: pointer; transition: color 0.2s; }
  .header-icons ha-icon:hover { color: #fff; }
  
  .phases-row { margin-bottom: 8px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;}
  .chips { display: flex; gap: 8px; }
  .chip { background: #333; padding: 5px 12px; border-radius: 16px; font-size: 12px; cursor: pointer; transition: background 0.2s; }
  .chip.active { background: #03a9f4; font-weight: bold; color: white;}
  
  /* --- UJEDNOLICENIE SUWAKÓW --- */
  .slider-row { margin-bottom: 8px; display: flex; align-items: center; gap: 8px; width: 100%; }
  .control-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; color: #ccc; gap: 8px; }
  
  /* Etykiety: "white-space: normal" pozwala zawijać tekst, gdy jest za długi */
  .slider-label, .control-label { font-size: 13px; color: #ccc; flex: 0 0 110px; white-space: normal; line-height: 1.2; word-wrap: break-word; }
  
  .right-controls { display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end; }
  select, input { max-width: 100%; box-sizing: border-box; overflow: hidden; text-overflow: ellipsis; }
  input[type=range] { flex: 1; min-width: 0; cursor: pointer; accent-color: #03a9f4; }
  
  .amp-box, .val-txt { font-weight: bold; font-size: 13px; flex: 0 0 45px; text-align: right; color: #fff; }

  /* --- KONIEC UJEDNOLICENIA --- */

  .sub-panel { background: #262626; border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 12px; }
  .section-title { color: #03a9f4; font-weight: bold; margin-bottom: 8px; font-size: 11px; letter-spacing: 1px; }
  .divider { height: 1px; background: #333; margin: 12px 0; }
  .active-icon { color: #03a9f4 !important; }
  .phase-line { font-size: 11px; margin-bottom: 4px; font-family: monospace; white-space: nowrap; color: #888;}
  
  .charging-progress-area { position: relative; margin: 2px 0; padding-bottom: 5px; }
  .time-left-display { position: absolute; width: 100%; text-align: center; font-size: 0.75em; color: var(--secondary-text-color); bottom: -14px; left: 0; }  
  .progress-container { height: 12px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; overflow: hidden; position: relative; }
  .progress-bar-gradient { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, #ff4d4d 0%, #fbff00 50%, #4caf50 100%); transition: clip-path 0.8s cubic-bezier(0.22, 1, 0.36, 1); z-index: 1; } 
  .power-row-inline { display: flex; flex-direction: row; justify-content: flex-start; align-items: baseline; gap: 10px; margin-top: 12px; padding-left: 2px; }
  .main-power { font-size: 28px; font-weight: bold; line-height: 1; color: #ffffff; }
  .sub-power { font-size: 14px; white-space: nowrap; color: #888888; }

  .marching-arrows { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; opacity: 0.6; z-index: 2; }
  .marching-arrows::before {  content: "»  »  »  »  »  »  »  »  »  »  »  »  »  »  »  »  »  »  »  »"; position: absolute; width: 200%; height: 100%; display: flex; align-items: center; font-family: monospace; font-size: 14px; font-weight: bold; color: white; letter-spacing: 15px; white-space: nowrap; }
  .charging .marching-arrows { display: block; }
  .charging .marching-arrows::before { animation: march 4s linear infinite; }
  @keyframes march { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
  .charging .progress-bar-gradient { animation: pulse-border 2s ease-in-out infinite; }
  @keyframes pulse-border { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }

  .data-row ha-icon { transition: color 0.3s ease; } 
  
  .led-wrapper { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; }
  .led.default-on { opacity: 1; }
  .led.active-anim { opacity: 1; box-shadow: 0 0 8px #fff; background: #fff; }
  .led { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #222; transition: background 0.2s, opacity 0.2s; }
  .led.blue { background: #4da3ff; box-shadow: 0 0 4px #4da3ff; }
  .led.green { background: #33ff33; box-shadow: 0 0 4px #33ff33; }
  .led.yellow { background: #fbff00; box-shadow: 0 0 4px #fbff00; }
  .led.white { background: #ffffff; box-shadow: 0 0 5px #ffffff; }
  .led.blue-blink { animation: led-blink 1s infinite; background: #4da3ff; }
  @keyframes led-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

  /* --- MEDIA QUERIES DLA TELEFONÓW (Poniżej 450px szerokości karty) --- */
  @media (max-width: 450px) {
    .slider-label, .control-label { flex: 0 0 85px; font-size: 11px; } /* Mniej miejsca na etykietę */
    .amp-box, .val-txt { flex: 0 0 38px; font-size: 12px; } /* Mniej miejsca na wartość */
    .slider-row, .control-row { gap: 6px; } /* ciaśniejsze odstępy między elementami */
  }
`;
