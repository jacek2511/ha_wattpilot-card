import { LitElement, html, css, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

export class WattpilotCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: any;
  @state() private _config?: any;

  public setConfig(config: any): void {
    this._config = config;
  }

  private _getValue(key: string) {
    return this._config && this._config[key] !== undefined ? this._config[key] : '';
  }

  private _valueChanged(ev: CustomEvent, configKey: string): void {
    if (!this._config || !this.hass) return;
    
    // ha-selector przekazuje nową wartość również w ev.detail.value
    const newValue = ev.detail.value;

    if (this._getValue(configKey) === newValue) return;

    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) {
      delete newConfig[configKey];
    } else {
      newConfig[configKey] = newValue;
    }

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const groups = [
      {
        label: "Status & Core Entities",
        fields: [
          { key: "entity_status", label: "Car State" },
          { key: "entity_reason", label: "Charging Reason" },
          { key: "entity_charging", label: "Charging (Connected)" },
          { key: "entity_power", label: "Charging Power (W/kW)" },
          { key: "entity_energy", label: "Grid/Home Balance" },
          { key: "entity_session_energy", label: "Session Energy" },
          { key: "entity_total_charged", label: "Total Charged (kWh)" },
        ]
      },
      {
        label: "Main Controls",
        fields: [
          { key: "entity_current", label: "Charging Current (Number)" },
          { key: "entity_mode", label: "Charging Mode (Select)" },
          { key: "entity_phase", label: "Phase Switch (Select)" },
          { key: "entity_charge_pause", label: "Charge Pause (Switch)" },
          { key: "entity_start", label: "Start Button" },
          { key: "entity_stop", label: "Stop Button" },
          { key: "entity_force", label: "Force Start Button" },
          { key: "entity_restart", label: "Restart Button" },
        ]
      },
      {
        label: "Vehicle & Battery",
        fields: [
          { key: "entity_soc", label: "Current SoC" },
          { key: "entity_soc_max", label: "Maximum SoC" },
          { key: "entity_target_soc", label: "Target SoC (Input)" },
          { key: "entity_min_soc", label: "Minimum SoC (Input)" },
          { key: "entity_range", label: "Range (km)" },
          { key: "entity_range_max", label: "Max Range (km)" },
          { key: "entity_charge_end", label: "Charging Time Left" },
        ]
      },
      {
        label: "Smart Features (Next Trip / Eco / PV)",
        fields: [
          { key: "entity_next_trip_pwr", label: "Next Trip Energy" },
          { key: "entity_next_trip_timing", label: "Next Trip Time" },
          { key: "entity_pv_surplus", label: "PV Surplus Switch" },
          { key: "entity_pv_threshold", label: "PV Battery Threshold" },
          { key: "entity_max_price", label: "Max Price (Smart Price)" },
          { key: "entity_awattar", label: "Awattar/Lumina Switch" },
          { key: "entity_eco_persist", label: "Remain in Eco Mode" },
          { key: "entity_start_at", label: "Start Charging At" },
        ]
      },
      {
        label: "Boost & Phase Settings",
        fields: [
          { key: "entity_boost", label: "Boost Switch" },
          { key: "entity_boost_type", label: "Boost Type (Select)" },
          { key: "entity_boost_limit", label: "Boost Limit (Number)" },
          { key: "entity_phase_power", label: "3-Phase Power Level" },
          { key: "entity_phase_delay", label: "Phase Switch Delay" },
          { key: "entity_phase_interval", label: "Phase Switch Interval" },
        ]
      },
      {
        label: "Technical Settings",
        fields: [
          { key: "entity_lock", label: "Lock Level (Select)" },
          { key: "entity_cable_unlock", label: "Cable Unlock (Select)" },
          { key: "entity_sim_unplug", label: "Simulate Unplugging" },
          { key: "entity_power_outage", label: "Unlock on Power Outage" },
          { key: "entity_ground_check", label: "Ground Check" },
          { key: "entity_led_save", label: "LED Energy Saving" },
          { key: "entity_min_time", label: "Min Charging Time" },
        ]
      },
      {
        label: "System & Network",
        fields: [
          { key: "entity_internal_error", label: "Internal Error Sensor" },
          { key: "entity_firmware_update", label: "Firmware Update" },
          { key: "entity_wifi_state", label: "WiFi State" },
          { key: "entity_wifi_conn", label: "WiFi Connection" },
          { key: "entity_wifi_signal", label: "WiFi Signal" },
          { key: "entity_hotspot_sw", label: "Disable Hotspot Switch" },
        ]
      }
    ];

    return html`
      <div class="card-config">
        ${groups.map(group => html`
          <div class="group">
            <div class="group-label">${group.label}</div>
            <div class="fields-container"> ${group.fields.map(f => html`
                <div class="field">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{ entity: {} }}
                    .value=${this._getValue(f.key)}
                    .label=${f.label}
                    .required=${false}
                    @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, f.key)}
                  ></ha-selector>
                </div>
              `)}
            </div>
          </div>
        `)}
        
        <div class="group">
          <div class="group-label">Side Columns (Left/Right)</div>
          <p class="note">
            Configuration for left1-left5 and right1-right5 (icons, color rules, attributes) 
            should be managed via the YAML Code Editor.
          </p>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      /* To zapewnia, że edytor nie rozpycha się w nieskończoność */
      display: block;
    }

    .card-config {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 4px; /* Mały padding, żeby nie dotykało krawędzi */
    }

    .group {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      background: var(--secondary-background-color);
    }

    .group-label {
      font-weight: bold;
      margin-bottom: 12px;
      color: var(--primary-color);
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.8px;
    }

    .fields-container {
      display: flex;
      flex-direction: column;
      gap: 12px; /* Odstępy między selektorami */
    }

    .field {
      width: 100%;
    }

    ha-selector {
      width: 100%;
      display: block;
    }

    .note {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 0;
      line-height: 1.4;
    }

    /* Jeśli koniecznie chcesz dwie kolumny na bardzo szerokich ekranach (powyżej 800px) */
    @media (min-width: 800px) {
      /* .fields-container { 
           display: grid; 
           grid-template-columns: 1fr 1fr; 
           gap: 12px; 
         } */
    }
  `;
}

customElements.define('wattpilot-card-editor', WattpilotCardEditor);
