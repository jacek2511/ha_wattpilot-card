import { LitElement, html, css, TemplateResult } from 'lit';

const Lit = (window as any).LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace")).LitElement;
const { html: litHtml, css: litCss } = (window as any).litGui || (window as any).LitElement;

export class WattpilotCardEditor extends Lit {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true }
    };
  }

  private _valueChanged(ev: any): void {
    if (!this._config || !this.hass) return;

    const target = ev.target;
    const configKey = target.configValue;

    const newValue =
      ev.detail?.value !== undefined ? ev.detail.value : target.value;

    if (this._config[configKey] === newValue) return;

    const newConfig = { ...this._config };

    if (newValue === "" || newValue === undefined) {
      delete newConfig[configKey];
    } else {
      newConfig[configKey] = newValue;
    }

    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

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
        label: "Smart Features",
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
          <ha-expansion-panel .header=${group.label} outlined>
            <div class="content">
              ${group.fields.map(f => html`
                <ha-entity-picker
                  .hass=${this.hass}
                  .label=${f.label}
                  .value=${this._config[f.key] || ''}
                  .configValue=${f.key}
                  .includeDomains=${[
                    'sensor',
                    'switch',
                    'number',
                    'select',
                    'binary_sensor',
                    'button',
                    'input_number',
                    'input_datetime',
                    'update'
                  ]}
                  @value-changed=${this._valueChanged}
                  allow-custom-entity
                ></ha-entity-picker>
              `)}
            </div>
          </ha-expansion-panel>
        `)}

        <ha-expansion-panel header="Side Columns (Left/Right)" outlined>
          <div class="content">
            <p class="note">
              Configuration for left/right columns should be done via YAML.
            </p>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    ha-expansion-panel {
      display: block;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background: var(--primary-background-color);
      /* Dodano min-height, aby zapobiec zapadaniu się zawartości przy asynchronicznym ładowaniu */
      min-height: 50px;
    }

    /* Zmieniono z hui-entity-picker na ha-entity-picker */
    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .note {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 0;
    }
  `;
}

customElements.define('wattpilot-card-editor', WattpilotCardEditor);
