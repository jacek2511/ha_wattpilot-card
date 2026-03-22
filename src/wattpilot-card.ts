import { styles } from './styles';
import { msToMin, minToMs, wToKw, kwToW, centsToEuro, euroToCents } from './helpers';
import './editor';

class WattpilotCard extends HTMLElement {
private _hass: any;
  private content: boolean = false;
  private config: any;
  private animIdx: number = 0;
  private animTimer: any = null;
  private elementsBound: boolean = false;

  // Rejestracja edytora w Home Assistant
  public static getConfigElement() {
    return document.createElement('wattpilot-card-editor');
  }

  public static getStubConfig() {
    return {
      name: 'Wattpilot',
      entity_l1_power: '',
      entity_max_price: '',
    };
  }

  set hass(hass: any) {
    this._hass = hass;
    if (!this.content) {
      this.initializeCard();
    }
    this.updateCard();
  }

  private initializeCard() {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <ha-card>
          <div class="card-header">
            <span id="reason-badge" class="reason-badge">Fronius WattPilot</span>
            <span id="status-badge" class="status-badge">--</span>
          </div>

          <div class="mode-row">
            <div class="mode-btn" data-val="Default"><ha-icon icon="mdi:flash"></ha-icon><span>Standard</span></div>
            <div class="mode-btn" data-val="Eco"><ha-icon icon="mdi:leaf"></ha-icon><span>Eco</span></div>
            <div class="mode-btn" data-val="Next Trip"><ha-icon icon="mdi:map-marker-distance"></ha-icon><span>Next Trip</span></div>
            <div class="action-stack">
              <div class="action-btn force" id="btn-force">FORCE</div>
              <div class="action-btn start" id="btn-start">START</div>
              <div class="action-btn stop" id="btn-stop">STOP</div>
            </div>
          </div>

          <div class="card-content">
            <div class="top-visuals">
              <div class="side-column left" id="left-col"></div>
              
              <div class="led-wrapper">
                <div id="led-ring"></div>
                <img src="${WATT_IMG}" class="device-img">
              </div>

              <div class="side-column right" id="right-col"></div>
            </div>

            <div class="ev-stats">
              <div class="top-line">
                <div class="soc-box">
                  <ha-icon id="soc-icon" icon="mdi:battery"></ha-icon>
                  <span id="soc-text">--/-- %</span>
                </div>
                <div class="range-box">
                  <ha-icon icon="mdi:road-variant"></ha-icon>
                  <span id="range-text">--/-- km</span>
                </div>
              </div>
              <div class="progress-bar"><div id="soc-bar"></div></div>
              
              <div class="charging-time" id="charge-end-text"></div>

              <div class="power-box">
                <span id="power">0.0 kW</span>
                <span id="power-details">
                  <span id="amp-val">0 A</span> 
                  <span id="session-energy" style="margin-left: 10px;">0 kWh</span>
                  <span id="phase-info" style="margin-left: 10px;">--</span>
                </span>
              </div>

              <div id="settings-panel" class="sub-panel hidden">
                <div class="section-title">SYSTEM SETTINGS</div>
                
                <div class="control-row">
                  <span class="control-label">Lock Level</span>
                  <select id="lock-sel" class="native-select" data-entity="entity_lock"></select>
                </div>
                <div class="control-row">
                  <span class="control-label">Cable Unlock</span>
                  <select id="cable-sel" class="native-select" data-entity="entity_cable_unlock"></select>
                </div>

                <div class="divider"></div>

                <div class="control-row">
                  <span class="control-label">Min Charge Time</span>
                  <div class="right-controls">
                    <input type="range" id="min-time" min="1" max="120" data-entity="entity_min_time" data-istime="true">
                    <span class="val-txt" id="min-time-txt">--m</span>
                  </div>
                </div>
                <div class="control-row">
                  <span class="control-label">Phase Switch Delay</span>
                  <div class="right-controls">
                    <input type="range" id="phase-delay" min="1" max="120" data-entity="entity_phase_delay" data-istime="true">
                    <span class="val-txt" id="phase-delay-txt">--m</span>
                  </div>
                </div>
                <div class="control-row">
                  <span class="control-label">Phase Switch Interval</span>
                  <div class="right-controls">
                    <input type="range" id="phase-interval" min="1" max="120" data-entity="entity_phase_interval" data-istime="true">
                    <span class="val-txt" id="phase-interval-txt">--m</span>
                  </div>
                </div>
                
                <div class="divider"></div>

                <div class="control-row">
                  <span class="control-label">PV Battery Threshold</span>
                  <div class="right-controls">
                    <input type="range" id="pv-threshold" min="0" max="100" data-entity="entity_pv_threshold">
                    <span class="val-txt" id="pv-threshold-txt">--%</span>
                  </div>
                </div>
                <div class="control-row">
                  <span class="control-label">Boost Discharge Until</span>
                  <div class="right-controls">
                    <input type="range" id="boost-limit" min="0" max="100" data-entity="entity_boost_limit">
                    <span class="val-txt" id="boost-limit-txt">--%</span>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="control-row">
                  <span class="control-label">3-Phase Power Level</span>
                  <div class="right-controls">
                    <input type="range" id="phase-power-lvl" min="0.1" max="32.0" step="0.1" data-entity="entity_phase_power" data-ispower="true" step="0.1">
                    <span class="val-txt" id="phase-power-lvl-txt">--kW</span>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="control-row"><span>Pause Charging</span><ha-switch id="pause-sw" data-entity="entity_charge_pause"></ha-switch></div>
                <div class="control-row"><span>Simulate Unplugging</span><ha-switch id="sim-unplug-sw" data-entity="entity_sim_unplug"></ha-switch></div>
                <div class="control-row"><span>Unlock on Power Outage</span><ha-switch id="power-outage-sw" data-entity="entity_power_outage"></ha-switch></div>
                <div class="control-row"><span>Ground Check</span><ha-switch id="ground-check-sw" data-entity="entity_ground_check"></ha-switch></div>
                <div class="control-row"><span>LED Energy Saving</span><ha-switch id="led-save-sw" data-entity="entity_led_save"></ha-switch></div>

                <div class="divider"></div>
                <button id="btn-restart" style="width:100%; padding:8px; border-radius:4px; border:1px solid #ef4444; background:transparent; color:#ef4444; cursor:pointer; font-weight:bold; margin-top:5px;">RESTART WATTPILOT</button>
              </div>

              <div id="wifi-panel" class="sub-panel hidden">
                <div class="section-title">WIFI CONFIGURATION</div>
                <div class="control-row"><span class="control-label">Status</span><span id="wifi-state-txt" class="val-txt">--</span></div>
                <div class="control-row"><span class="control-label">Network</span><span id="wifi-conn-txt" class="val-txt">--</span></div>
                <div class="control-row"><span class="control-label">Signal Strength</span><span id="wifi-signal-txt" class="val-txt">--</span></div>
                <div class="divider" style="margin: 8px 0; opacity: 0.1;"></div>
                <div class="control-row">
                  <span class="control-label">Auto Disable Hotspot</span>
                  <ha-switch id="hotspot-sw" data-entity="entity_hotspot_sw"></ha-switch>
                </div>
              </div>

              <div id="info-panel" class="sub-panel hidden">
                <div class="section-title">CHARGER INFO</div>
                <div class="control-row">
                  <span class="control-label">Total Charged</span>
                  <span id="total-charged-txt" class="val-txt">-- kWh</span>
                </div>
                <div class="divider" style="margin: 8px 0; opacity: 0.1;"></div>
                <style>
                  .phase-line { font-size: 11px; margin-bottom: 4px; font-family: monospace; white-space: nowrap; }
                  .phase-label { font-weight: bold; color: var(--primary-color); display: inline-block; width: 25px; }
                </style>
                <div id="l1-line" class="phase-line"></div>
                <div id="l2-line" class="phase-line"></div>
                <div id="l3-line" class="phase-line"></div>
                <div id="n-line" class="phase-line"></div>
                <div class="divider" style="margin: 8px 0; opacity: 0.1;"></div>
                <div class="info-item" style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="info-label" style="flex-grow: 1;">Internal Error</span>
                  <span id="internal-error-txt" class="val-txt" data-entity="entity_internal_error" style="text-align: right;">None</span>
                </div>
                <div class="info-item" style="flex-direction: column; align-items: stretch; margin-top: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="info-label">Firmware Update</span>
                    <span id="firmware-update-txt" class="val-txt" data-entity="entity_firmware_update">--</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
                    <span style="font-size: 10px; color: var(--secondary-text-color);">Firmware Version (installed/latest)</span>
                    <span id="firmware-version-txt" style="font-size: 10px; color: var(--secondary-text-color);">-- / --</span>
                  </div>

                  <div id="update-progress-container" style="display: none; width: 100%; background: #444; height: 6px; border-radius: 3px; overflow: hidden; margin-top: 6px;">
                    <div id="update-progress-bar" style="width: 0%; height: 100%; background: #4caf50; transition: width 0.3s;"></div>
                  </div>

                  <ha-button id="btn-install-update" raised 
                             style="display: none; width: 100%; margin-top: 8px; --mdc-theme-primary: #4caf50; height: 32px; font-size: 12px;">
                    Update Now
                  </ha-button>
                </div>
              </div>

              <div id="charge-settings-panel" class="sub-panel hidden">
                <div class="section-title">BATTERY & LIMITS</div>
                <div class="control-row">
                  <span class="control-label">Target SoC</span>
                  <div class="right-controls">
                    <input type="range" id="target-soc" min="0" max="100" data-entity="entity_target_soc">
                    <span class="val-txt" id="target-soc-txt">--%</span>
                  </div>
                </div>
                <div class="control-row">
                  <span class="control-label">Min SoC</span>
                  <div class="right-controls">
                    <input type="range" id="min-soc" min="0" max="100" data-entity="entity_min_soc">
                    <span class="val-txt" id="min-soc-txt">--%</span>
                  </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="control-row"><span>Enable Boost</span><ha-switch id="boost-sw" data-entity="entity_boost"></ha-switch></div>
                <div class="control-row">
                  <span class="control-label">Boost Type</span>
                  <select id="boost-type-sel" class="native-select" data-entity="entity_boost_type"></select>
                </div>

                <div class="divider"></div>

                <div class="control-row"><span>PV Surplus Only</span><ha-switch id="pv-surplus-sw" data-entity="entity_pv_surplus"></ha-switch></div>
                <div class="control-row">
                  <span class="control-label">Start Charging At</span>
                  <div class="input-with-unit-wrapper">
                    <input type="number" id="start-at" class="num-input" data-entity="entity_start_at" data-ispower="true" step="0.1">
                    <span class="inner-unit">kW</span>
                  </div>
                </div>
                <div class="control-row"><span>Use aWATTar</span><ha-switch id="awattar-sw" data-entity="entity_awattar"></ha-switch></div>
                <div class="control-row">
                  <span class="control-label">Max Price</span>
                  <div class="right-controls">
                    <div class="input-with-unit-wrapper" style="flex: 0 0 100px;">
                      <input type="number" id="max-price-input" class="num-input" 
                             step="0.01" min="0" data-entity="entity_max_price" data-isprice="true">
                      <span class="inner-unit">€</span>
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="control-row">
                  <span class="control-label">Next Trip Power</span>
                  <div class="input-with-unit-wrapper">
                    <input type="number" id="next-trip-pwr" class="num-input" data-entity="entity_next_trip_pwr" data-ispower="true" step="0.1">
                    <span class="inner-unit">kW</span>
                  </div>
                </div>
                <div class="control-row">
                  <span class="control-label">Next Trip Time</span>
                  <div class="right-controls">
                    <div class="input-with-unit-wrapper" style="flex: 0 0 100px;">
                      <input type="time" id="next-trip-time" class="num-input" 
                             data-entity="entity_next_trip_timing">
                    </div>
                  </div>
                </div>
                <div class="control-row"><span>Remain in Eco Mode</span><ha-switch id="eco-persist-sw" data-entity="entity_eco_persist"></ha-switch></div>
              </div>

              <div class="divider"></div>
              
              <div class="section-header">
                <div class="section-title" style="margin:0;">CHARGE CURRENT</div>
                <div class="header-actions">
                  <ha-icon icon="mdi:information-outline" class="sub-menu-trigger" data-target="info-panel" title="Info"></ha-icon>
                  <ha-icon icon="mdi:wifi-cog" class="sub-menu-trigger" data-target="wifi-panel" title="WiFi Settings"></ha-icon>
                  <ha-icon icon="mdi:battery-charging-60" class="sub-menu-trigger" data-target="charge-settings-panel" title="Charge Settings"></ha-icon>
                  <ha-icon icon="mdi:cog" class="sub-menu-trigger" data-target="settings-panel" title="Settings"></ha-icon>
 
                </div>
              </div>

              <div class="control-row">
                <span class="control-label">Phases</span>
                <div class="right-controls">
                  <div class="phase-btns" id="phase-ctrl">
                    <div class="phase-btn" data-val="Auto">Auto</div>
                    <div class="phase-btn" data-val="1 Phase">1</div>
                    <div class="phase-btn" data-val="3 Phases">3</div>
                  </div>
                </div>
              </div>

              <div class="control-row" style="margin-top: 10px;">
                <span class="control-label">Max Current</span>
                <div class="right-controls">
                  <input type="range" id="slider-current" min="6" max="32">
                  <span style="width: 40px; text-align: right; font-weight:bold;" id="curr-val-txt">-- A</span>
                </div>
              </div>
            </div>
          </div>
        </ha-card>
      `;
      this.content = true;
      this.createLedRing();
      this.bindEvents();
      this.animIdx = 0;
      this.startAnimationLoop();
      this.animTimer = null;
    }
  }

  public setConfig(config: any) {
    if (!config) throw new Error('Invalid configuration');
    this.config = config;
  }

  private updateCard() {
    if (!this._hass || !this.config) return;
    const states = this._hass.states;

    // Lista selektorów do aktualizacji (Twoja logika z updateData)
    const uiElements = [
      '#l1-power-input', '#l2-power-input', '#l3-power-input',
      '#max-price-input', '#next-trip-time', '#internal-error-txt',
      '#firmware-update-txt'
    ];

    uiElements.forEach(selector => this.updateUIElement(selector, states));
    this.updateLiveStats(states); // Twoja funkcja obliczająca fazy
  }

  // Tutaj wklej pozostałe metody: updateUIElement, bindUIElement, bindEvents, updateLiveStats
  // Pamiętaj, aby funkcje pomocnicze wywoływać bez "this." jeśli zaimportowałeś je z helpers.ts
  private createLedRing() {
    const ring = this.shadowRoot?.querySelector('#led-ring');
    if (!ring) return;
    ring.innerHTML = '';
    for (let i = 0; i < 32; i++) {
      const led = document.createElement('div');
      led.className = 'led';
      const angle = (i / 32) * 360 - 90;
      led.style.transform = `rotate(${angle}deg) translate(26px) rotate(${-angle}deg)`;
      ring.appendChild(led);
    }
  }

  private updateLedRing(status: string, amps: string | number, mode: string, phases: string, reason: string): void {
    this._currentAmps = typeof amps === 'string' ? parseInt(amps, 10) : amps;
    this._currentStatus = (status || '').toLowerCase();
    this._currentMode = mode;
    this._currentPhases = phases;
    this._currentReason = reason;
  }

  private renderLeds(): void {
    if (!this.shadowRoot) return;

    // Pobieramy diody przez shadowRoot
    const leds = this.shadowRoot.querySelectorAll<HTMLElement>('.led');
    if (leds.length === 0) return;

    // Resetowanie stanu wszystkich diod
    leds.forEach((l) => {
      l.className = 'led';
      l.style.opacity = '1';
      l.style.animation = 'none';
    });

    const status = this._currentStatus || '';
    const activeAmps = Math.min(32, this._currentAmps || 6);

    // 1. Obsługa wskaźników trybu (Eco / Next Trip) gdy nie ładuje
    if (!status.includes('charging')) {
      if (this._currentMode === 'Eco' && leds[0]) leds[0].classList.add('white');
      if (this._currentMode === 'Next Trip' && leds[1]) leds[1].classList.add('white');
    }

    // 2. Logika animacji ładowania
    if (status.includes('charging')) {
      const count = this._currentPhases === '1-Phase' ? 1 : 3;
      const tailLength = 4;

      for (let i = 0; i < count; i++) {
        // Obliczanie pozycji głowy animacji (animIdx zmienia się w pętli setInterval)
        const pos = (this.animIdx + i * 10) % 32;

        for (let t = 0; t < tailLength; t++) {
          const tailPos = (pos - t + 32) % 32;

          if (tailPos < activeAmps) {
            const led = leds[tailPos];
            led.classList.add('blue', 'breathing');

            if (t === 0) {
              led.style.opacity = '1';
            } else {
              const tailOpacity = Math.max(0.1, 0.8 - (t / tailLength) * 0.7);
              led.classList.add('fading');
              led.style.opacity = tailOpacity.toString();
            }
          }
        }
      }
    } 
    // 3. Logika stanów statycznych (oczekiwanie, błąd, gotowość)
    else {
      for (let i = 0; i < activeAmps; i++) {
        const led = leds[i];
        if (!led) continue;

        if (this._currentReason === 'NotChargingBecauseFallbackAwattar') {
          led.classList.add('blue-blink');
        } else if (status.includes('wait car')) {
          led.classList.add('yellow');
        } else if (
          status.includes('complete') &&
          (this._currentReason === 'ChargingBecausePvSurplus' ||
           this._currentReason === 'ChargingBecauseForceStateOn' ||
           this._currentReason === 'ChargingBecauseFallbackDefault')
        ) {
          led.classList.add('green');
        } else {
          led.classList.add('blue');
        }
      }
    }
  }

  private updateWhiteSlider(val: number): void {
    if (!this.shadowRoot) return;

    // Pobieramy suwak i rzutujemy na HTMLElement, aby mieć dostęp do .style
    const slider = this.shadowRoot.querySelector('#slider-current') as HTMLElement;
    const textLabel = this.shadowRoot.querySelector('#curr-val-txt') as HTMLElement;

    if (slider) {
      // Obliczamy procent (zakładając zakres Wattpilota 6A - 32A)
      const pct = ((val - 6) / (32 - 6)) * 100;
      
      // Ustawiamy zmienną CSS --v, która w Twoich stylach odpowiada za wypełnienie paska
      slider.style.setProperty('--v', `${pct}%`);
      
      // Jeśli masz standardowy input typu range, aktualizujemy też jego wartość
      if (slider instanceof HTMLInputElement) {
        slider.value = val.toString();
      }
    }

    if (textLabel) {
      textLabel.innerText = `${val} A`;
    }
  }
  
  private startAnimationLoop() {
    if (this._mainLoop) return;
    this._mainLoop = setInterval(() => {
      const status = (this._hass.states[this.config.entity_status]?.state || '').toLowerCase();
      if (status.includes('charging')) {
        this.animIdx = (this.animIdx + 1) % 32;
        this.renderLeds();
      }
    }, 100);
  }

  private renderSideColumn(side: 'left' | 'right'): void {
    if (!this.shadowRoot) return;
    
    const col = this.shadowRoot.querySelector(`#${side}-col`);
    if (!col) return;

    col.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
      const cfg = this.config[`${side}${i}`];
      if (cfg && cfg.entity) {
        const row = document.createElement('div');
        row.className = 'data-row';
        row.id = `row-${side}-${i}`;
        
        // Tworzymy strukturę wewnątrz wiersza
        row.innerHTML = `
          <ha-icon id="icon-${side}-${i}"></ha-icon>
          <span id="val-${side}-${i}"></span>
        `;
        
        col.appendChild(row);
      }
    }
  }

  private updateSideColumn(side: 'left' | 'right'): void {
    if (!this.shadowRoot || !this._hass) return;

    for (let i = 1; i <= 5; i++) {
      const cfg = this.config[`${side}${i}`];
      if (!cfg || !cfg.entity) continue;

      const stateObj = this._hass.states[cfg.entity];
      if (!stateObj) continue;

      // Pobieranie wartości (z atrybutu lub stanu głównego)
      let val = cfg.attribute ? stateObj.attributes[cfg.attribute] : stateObj.state;
      const numericVal = parseFloat(val);
      
      // Zaokrąglanie jeśli wartość jest liczbą
      if (!isNaN(numericVal) && val !== '' && val !== null) {
        val = Math.round(numericVal);
      }
      
      const unit = cfg.unit || stateObj.attributes.unit_of_measurement || '';
      const icon = cfg.icon || stateObj.attributes.icon || 'mdi:dots-horizontal';
      
      // Pobieranie referencji do elementów w Shadow DOM
      const valEl = this.shadowRoot.querySelector(`#val-${side}-${i}`) as HTMLElement;
      const iconEl = this.shadowRoot.querySelector(`#icon-${side}-${i}`) as any;

      if (valEl) {
        valEl.innerText = `${val}${unit}`;
      }

      if (iconEl) {
        iconEl.setAttribute('icon', icon);
        
        // Logika kolorowania ikony
        let iconColor = 'var(--primary-color)'; 
        
        if (cfg.color_rules) {
          if (typeof cfg.color_rules === 'string') {
            iconColor = cfg.color_rules;
          } else if (Array.isArray(cfg.color_rules)) {
            // Sortujemy reguły, aby ostatnia spełniona była tą właściwą (rosnąco)
            const rules = [...cfg.color_rules].sort((a, b) => a.value - b.value);
            for (const rule of rules) {
              if (numericVal >= rule.value) {
                iconColor = rule.color;
              }
            }
          }
        }
        iconEl.style.color = iconColor;
      }
    }
  }
  
  private bindEvents() {
    this.querySelectorAll('.mode-btn').forEach(btn => {
      btn.onclick = () => this._hass.callService('select', 'select_option', { entity_id: this.config.entity_mode, option: btn.dataset.val });
    });

    this.querySelector('#btn-start').onclick = () => this._hass.callService('button', 'press', { entity_id: this.config.entity_start });
    this.querySelector('#btn-stop').onclick = () => this._hass.callService('button', 'press', { entity_id: this.config.entity_stop });
    this.querySelector('#btn-force').onclick = () => this._hass.callService('button', 'press', { entity_id: this.config.entity_force });
    
    const btnRestart = this.querySelector('#btn-restart');
    if (btnRestart) {
      btnRestart.onclick = () => {
        if(confirm("Are you sure you want to restart Wattpilot?")) {
          this._hass.callService('button', 'press', { entity_id: this.config.entity_restart });
        }
      };
    }

    const installBtn = this.querySelector('#btn-install-update');
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        const entityId = this.config.entity_firmware_update;
        if (entityId) {
          this._hass.callService('update', 'install', {
            entity_id: entityId
          });
          // Opcjonalna blokada przycisku po kliknięciu
          installBtn.disabled = true;
          installBtn.innerText = "Starting...";
        }
      });
    }

    // Specjalna obsługa suwaka głównego prądu
    const currSlider = this.querySelector('#slider-current');
    currSlider.oninput = (e) => {
      const val = parseInt(e.target.value);
      this._isInteractingC = true; 
      this._currentAmps = val;     
      this.updateWhiteSlider(val);
      this.renderLeds();           
    };
    currSlider.onchange = (e) => {
      this._hass.callService('number', 'set_value', { entity_id: this.config.entity_current, value: parseInt(e.target.value) });
      setTimeout(() => { this._isInteractingC = false; }, 1000);
    };

    this.querySelectorAll('#phase-ctrl .phase-btn').forEach(btn => {
      btn.onclick = () => this._hass.callService('select', 'select_option', { entity_id: this.config.entity_phase, option: btn.dataset.val });
    });

    // Sub-menu logka
    this.querySelectorAll('.sub-menu-trigger').forEach(trigger => {
      trigger.onclick = () => {
        const targetId = trigger.dataset.target;
        const targetPanel = this.querySelector(`#${targetId}`);
        const isActive = trigger.classList.contains('active');
        this.querySelectorAll('.sub-menu-trigger').forEach(t => t.classList.remove('active'));
        this.querySelectorAll('.sub-panel').forEach(p => p.classList.add('hidden'));
        if (!isActive) {
          trigger.classList.add('active');
          targetPanel.classList.remove('hidden');
        }
      };
    });

    // Bindowanie wszystkich nowych elementów
    this.bindUIElement('#target-soc', 'input_number', 'set_value');
    this.bindUIElement('#min-soc', 'input_number', 'set_value');
    this.bindUIElement('#boost-limit', 'number', 'set_value');
    this.bindUIElement('#next-trip-pwr', 'number', 'set_value');
    this.bindUIElement('#min-time', 'number', 'set_value');
    this.bindUIElement('#phase-delay', 'number', 'set_value');
    this.bindUIElement('#phase-interval', 'number', 'set_value');
    this.bindUIElement('#pv-threshold', 'number', 'set_value');
    this.bindUIElement('#phase-power-lvl', 'number', 'set_value');
    this.bindUIElement('#start-at', 'number', 'set_value');
    this.bindUIElement('#max-price-input', 'number', 'set_value');

    this.bindUIElement('#lock-sel', 'select', 'select_option', 'option');
    this.bindUIElement('#cable-sel', 'select', 'select_option', 'option');
    this.bindUIElement('#boost-type-sel', 'select', 'select_option', 'option');

    this.bindUIElement('#next-trip-time', 'input_datetime', 'set_datetime', 'time');

    this.bindUIElement('#hotspot-sw', 'switch', '');
    this.bindUIElement('#pause-sw', 'switch', '');
    this.bindUIElement('#boost-sw', 'switch', '');
    this.bindUIElement('#pv-surplus-sw', 'switch', '');
    this.bindUIElement('#eco-persist-sw', 'switch', '');
    this.bindUIElement('#sim-unplug-sw', 'switch', '');
    this.bindUIElement('#power-outage-sw', 'switch', '');
    this.bindUIElement('#ground-check-sw', 'switch', '');
    this.bindUIElement('#led-save-sw', 'switch', '');
    this.bindUIElement('#awattar-sw', 'switch', '');
  }

  // Pamiętaj o dodaniu metody disconnectedCallback, 
  // aby zatrzymać animację, gdy karta znika z ekranu (dobra praktyka):
  disconnectedCallback() {
    if (this.animTimer) {
      cancelAnimationFrame(this.animTimer);
    }
  }
  
  getCardSize() {
    return 3;
  }
}

customElements.define('wattpilot-card', WattpilotCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'wattpilot-card',
  name: 'Wattpilot Card',
  preview: true,
  description: 'A custom card for Fronius Wattpilot charger',
});
