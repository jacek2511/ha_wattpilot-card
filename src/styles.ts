import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }
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

  .led-wrapper { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; }
  .device-img { width: 70px; z-index: 2; position: relative; }
  #led-ring { position: absolute; width: 100%; height: 100%; top: 28px; left: 0; z-index: 3; pointer-events: none; }
  
  /* Zmodyfikowany blok LED pod framework Lit */
  .led { position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; background: rgba(255,255,255,0.1); border-radius: 50%; margin: -1.5px; }
  .led.blue { background: #03a9f4; box-shadow: 0 0 4px #03a9f4; opacity: 0.3; }
  .led.green { background: #4caf50; box-shadow: 0 0 4px #4caf50; opacity: 1; }
  .led.yellow { background: #ffeb3b; box-shadow: 0 0 4px #ffeb3b; opacity: 1; }
  .led.default-on { opacity: 1; }
  .led.active-anim { opacity: 1; box-shadow: 0 0 8px #fff; background: #fff; }

  .soc-range-row { display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-top: 2px; margin-bottom: 4px; }
  .stat-item { display: flex; align-items: center; gap: 4px; }
  .stat-item ha-icon { --mdc-icon-size: 14px; }

  .progress-bar-bg { height: 6px; background: #333; border-radius: 3px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #f44336, #ffeb3b, #4caf50); transition: width 0.3s ease; }
  
  .time-left-text { text-align: center; font-size: 11px; color: #03a9f4; margin-top: 4px; font-weight: 500; }

  .power-row-inline { display: flex; align-items: baseline; gap: 10px; margin-top: 6px; }
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
`;
