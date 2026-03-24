import { css } from 'lit';

export const cardStyles = css`
  :host { display: block; }
  ha-card { padding: 4px 12px 12px 12px; background: #1c1c1c; color: white; overflow: hidden; }
  .card-header { display: flex; justify-content: space-between; margin-top: -12px; margin-bottom: -2px; height: 32px; align-items: center;  }
  .reason-badge { border: 1px solid #333; padding: 1px 8px; border-radius: 12px; color: #666; font-size: 10px; }
  .status-badge { border: 1px solid #03a9f4; color: #03a9f4; padding: 1px 8px; border-radius: 12px; font-weight: bold; font-size: 10px; }
  
  /* Dodatkowa klasa dla statusu ładującego */
  .status-badge.charging-status { border-color: #4caf50; color: #4caf50; background: rgba(76, 175, 80, 0.1); }

  .top-controls-grid { display: flex; gap: 8px; margin-top: -10px; margin-bottom: 8px; }
  .modes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; flex: 1; }
  .actions-grid { display: flex; flex-direction: column; gap: 4px; width: 80px; }

  .mode-btn { 
    background: #262626; border-radius: 6px; display: flex; flex-direction: column; 
    align-items: center; justify-content: center; padding: 2px; cursor: pointer; height: 44px;
  }
  .mode-btn.active { border-color: #03a9f4; background: rgba(3,169,244,0.1); border-width: 1px; border-style: solid; }
  .mode-btn ha-icon { --mdc-icon-size: 20px; }
  .mode-btn span { font-size: 10px; }

  .action-btn { height: 20px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-top: 0px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .force { background: #ff9800; color: black; }
  .start { background: #4caf50; color: black; }
  .stop { background: #f44336; color: white; height: 44px; }

  /* ŚRODEK */
  .visual-center { display: flex; justify-content: space-between; align-items: center; height: 110px; margin-top: 18px; }
  .side-column { display: flex; flex-direction: column; gap: 4px; width: 85px; margin-top: -12px; }
  .data-row { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #ccc; white-space: nowrap; }
  .data-row.right { justify-content: flex-end; text-align: right; }
  .data-row ha-icon { --mdc-icon-size: 16px; color: #03a9f4; }
  
  .device-container { position: relative; width: 71px; margin: 0 auto; display: flex; justify-content: center; }
  .device-img { width: 100%; z-index: 1; display: block; }
  #led-ring { position: absolute; top: 68%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: 1px; height: 1px; pointer-events: none; }
  
  .soc-range-row { display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-top: 2px; margin-bottom: 4px; }
  .stat-item { display: flex; align-items: center; gap: 4px; }
  .stat-item ha-icon { --mdc-icon-size: 14px; }
 
  .time-left-text { text-align: center; font-size: 11px; color: #03a9f4; margin-top: 4px; font-weight: 500; }

  .main-power { font-size: 32px; font-weight: bold; line-height: 1; }
  .sub-power { font-size: 14px; color: #777; }

  .settings-area { border-top: 1px solid #333; padding-top: 12px; margin-top: 8px; display: flex; flex-direction: column; gap: 12px; }
  .settings-header { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #555; }
  .header-icons { display: flex; gap: 12px; color: #888; }
  .header-icons ha-icon { cursor: pointer; transition: color 0.2s; }
  .header-icons ha-icon:hover { color: #fff; }
  
  .phases-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px;}
  .chips { display: flex; gap: 8px; }
  .chip { background: #333; padding: 4px 12px; border-radius: 12px; font-size: 11px; cursor: pointer; transition: background 0.2s; }
  .chip.active { background: #03a9f4; font-weight: bold; color: white;}
  
  .slider-row { display: flex; align-items: center; gap: 12px; }
  .slider-label { font-size: 14px; color: #ccc; min-width: 90px; }
  input[type=range] { flex: 1; accent-color: #03a9f4; }
  .amp-box { font-weight: bold; font-size: 14px; min-width: 35px; text-align: right; }

  .sub-panel { background: #262626; border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 12px; }
  .section-title { color: #03a9f4; font-weight: bold; margin-bottom: 8px; font-size: 11px; letter-spacing: 1px; }
  .control-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; color: #ccc; }
  .divider { height: 1px; background: #333; margin: 12px 0; }
  .active-icon { color: #03a9f4 !important; }
  .phase-line { font-size: 11px; margin-bottom: 4px; font-family: monospace; white-space: nowrap; color: #888;}
  
  .charging-progress-area {
    position: relative; /* Ważne dla pozycjonowania czasu */
    margin: 15px 0;
    padding-bottom: 5px; /* Rezerwujemy stałe miejsce na czas */
  }
  
  .progress-container {
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }

  .progress-bar-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%; /* Rozciąga się na cały kontener, a clip-path go docina */
    height: 100%;
    background: linear-gradient(90deg, #ff4d4d 0%, #fbff00 50%, #4caf50 100%);
    transition: clip-path 0.8s cubic-bezier(0.22, 1, 0.36, 1); /* Płynne przesuwanie paska */
    z-index: 1;
  }
  
  /* Upewnij się, że shimmer jest nad gradientem */
  .shimmer-layer {
    z-index: 2;
  }

  /* Nowa klasa dla napisu czasu, która nie przesuwa layoutu */
  .time-left-display {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 0.75em;
    color: var(--secondary-text-color);
    bottom: -14px; /* Wyrzuca napis pod pasek, ale wewnątrz marginesu area */
    left: 0;
  }
  
  .power-row-inline {
    margin-top: 10px; /* Stały odstęp, niezależny od tego czy jest czas czy nie */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Warstwa animowana */
  .shimmer-layer {
      display: none; /* Domyślnie ukryta */
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
      );
  }
  
  /* Aktywacja animacji gdy jest klasa .charging */
  .charging .shimmer-layer {
      display: block;
      animation: shimmer 1.5s infinite;
  }
  
  /* Definicja ruchu */
  @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
  }
    
  /* Style ikon bocznych */
  .data-row ha-icon {
    transition: color 0.3s ease;
  } 
  
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

`;
