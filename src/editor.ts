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
    const newValue = ev.detail.value;

    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) {
      delete newConfig[configKey];
    } else {
      newConfig[configKey] = newValue;
    }

    this._config = newConfig;

    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }

  private _toggleAttribute(configKey: string): void {
    const attrKey = `${configKey}_attr`;
    const newConfig = { ...this._config };

    if (newConfig[attrKey] !== undefined) {
      delete newConfig[attrKey];
    } else {
      newConfig[attrKey] = "";
    }

    this._config = newConfig;

    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }

  // Pomocnicza funkcja renderowania dla Customize View
  private renderSideEntity(key: string, label: string): TemplateResult {
    const entityId = this._getValue(key);
    const attrKey = `${key}_attr`;
    const isAttrEnabled = this._config[attrKey] !== undefined;
    
    const stateObj = entityId ? this.hass.states[entityId] : null;
    const baseAttrs = ['friendly_name', 'icon', 'unit_of_measurement', 'device_class', 'state_class', 'restored', 'supported_features', 'attribution', 'description'];
    const hasExtraAttributes = stateObj && Object.keys(stateObj.attributes).some(attr => !baseAttrs.includes(attr));

    return html`
      <div class="side-entity-box">
        <div class="side-entity-header">${label}</div>
        
        <div class="selector-with-checkbox">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ entity: {} }}
            .value=${entityId}
            .label="Entity"
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, key)}
          ></ha-selector>
          
          ${hasExtraAttributes ? html`
            <div class="checkbox-container" title="Use Attribute">
              <ha-checkbox .checked=${isAttrEnabled} @change=${(e: any) => { e.stopPropagation(); this._toggleAttribute(key); }}></ha-checkbox>
              <ha-icon icon="hass:file-tree"></ha-icon>
            </div>
          ` : ''}
        </div>

        ${isAttrEnabled && hasExtraAttributes ? html`
          <div class="attr-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{ attribute: { entity_id: entityId, hide_attributes: baseAttrs } }}
              .value=${this._getValue(attrKey)}
              .label="Attribute"
              @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, attrKey)}
            ></ha-selector>
          </div>
        ` : ''}

        <div class="side-row-tools">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ icon: {} }}
            .value=${this._getValue(`${key}_icon`)}
            .label="Icon"
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, `${key}_icon`)}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_color: {} }}
            .value=${this._getValue(`${key}_color`)}
            .label="Icon Color"
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, `${key}_color`)}
          ></ha-selector>
        </div>

        <div class="threshold-container">
           <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_color: {} }}
            .value=${this._getValue(`${key}_warn_color`)}
            .label="Warn Color"
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, `${key}_warn_color`)}
          ></ha-selector>
          <ha-selector
            .hass=${this.hass}
            .selector=${{ number: { mode: "box" } }}
            .value=${this._getValue(`${key}_threshold`)}
            .label="Warn Above Value"
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, `${key}_threshold`)}
          ></ha-selector>
        </div>
      </div>
    `;
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const groups = [
      { label: "Status & Core Entities", icon: "hass:information-outline", fields: [{ key: "entity_status", label: "Car State" }, { key: "entity_reason", label: "Charging Reason" }, { key: "entity_charging", label: "Charging (Connected)" }, { key: "entity_power", label: "Charging Power" }, { key: "entity_energy", label: "Grid/Home Balance" }, { key: "entity_session_energy", label: "Session Energy" }, { key: "entity_total_charged", label: "Total Charged (kWh)" }] },
      { label: "Main Controls", icon: "hass:tune", fields: [{ key: "entity_current", label: "Charging Current" }, { key: "entity_mode", label: "Charging Mode" }, { key: "entity_phase", label: "Phase Switch" }, { key: "entity_charge_pause", label: "Charge Pause" }, { key: "entity_start", label: "Start Button" }, { key: "entity_stop", label: "Stop Button" }] },
      { label: "Vehicle & Battery", icon: "hass:car-electric", fields: [{ key: "entity_soc", label: "Current SoC" }, { key: "entity_soc_max", label: "Maximum SoC" }, { key: "entity_target_soc", label: "Target SoC" }, { key: "entity_min_soc", label: "Minimum SoC" }, { key: "entity_range", label: "Range (km)" }, { key: "entity_range_max", label: "Max Range (km)" }, { key: "entity_charge_end", label: "Charging Time Left" }] },
      { label: "Smart Features", icon: "hass:solar-power", fields: [{ key: "entity_next_trip_pwr", label: "Next Trip Energy" }, { key: "entity_next_trip_timing", label: "Next Trip Time" }, { key: "entity_pv_surplus", label: "PV Surplus Switch" }, { key: "entity_pv_threshold", label: "PV Battery Threshold" }, { key: "entity_max_price", label: "Max Price" }, { key: "entity_awattar", label: "Awattar/Lumina Switch" }, { key: "entity_eco_persist", label: "Remain in Eco Mode" }, { key: "entity_start_at", label: "Start Charging At" }] },
      { label: "Boost & Phase Settings", icon: "hass:lightning-bolt-outline", fields: [{ key: "entity_boost", label: "Boost Switch" }, { key: "entity_boost_type", label: "Boost Type" }, { key: "entity_boost_limit", label: "Boost Limit" }, { key: "entity_phase_power", label: "3-Phase Power Level" }, { key: "entity_phase_delay", label: "Phase Switch Delay" }, { key: "entity_phase_interval", label: "Phase Switch Interval" }] },
      { label: "Technical Settings", icon: "hass:cog", fields: [{ key: "entity_lock", label: "Lock Level" }, { key: "entity_cable_unlock", label: "Cable Unlock" }, { key: "entity_sim_unplug", label: "Simulate Unplugging" }, { key: "entity_power_outage", label: "Unlock on Power Outage" }, { key: "entity_ground_check", label: "Ground Check" }, { key: "entity_led_save", label: "LED Energy Saving" }, { key: "entity_min_time", label: "Min Charging Time" }] },
      { label: "System & Network", icon: "hass:wifi", fields: [{ key: "entity_internal_error", label: "Internal Error Sensor" }, { key: "entity_firmware_update", label: "Firmware Update" }, { key: "entity_wifi_state", label: "WiFi State" }, { key: "entity_wifi_conn", label: "WiFi Connection" }, { key: "entity_wifi_signal", label: "WiFi Signal" }, { key: "entity_hotspot_sw", label: "Disable Hotspot Switch" }] }
    ];

    return html`
      <div class="card-config">
        ${groups.map(group => html`
          <ha-expansion-panel outlined header=${group.label}>
            <ha-icon slot="header" .icon=${group.icon} class="header-icon"></ha-icon>
            <div class="fields-container">
              ${group.fields.map(f => {
                const entityId = this._getValue(f.key);
                const attrKey = `${f.key}_attr`;
                const isAttrEnabled = this._config[attrKey] !== undefined;
                const stateObj = entityId ? this.hass.states[entityId] : null;
                const baseAttrs = ['friendly_name', 'icon', 'unit_of_measurement', 'device_class', 'state_class', 'restored', 'supported_features', 'attribution', 'description'];
                const hasExtraAttributes = stateObj && Object.keys(stateObj.attributes).some(attr => !baseAttrs.includes(attr));

                return html`
                <div class="field-row">
                  <div class="selector-with-checkbox">
                    <ha-selector
                      .hass=${this.hass}
                      .selector=${{ entity: {} }}
                      .value=${entityId}
                      .label=${f.label}
                      @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, f.key)}
                    ></ha-selector>
                    ${hasExtraAttributes ? html`
                      <div class="checkbox-container" title="Use Attribute">
                        <ha-checkbox .checked=${isAttrEnabled} @change=${(e: Event) => { e.stopPropagation(); this._toggleAttribute(f.key); }}></ha-checkbox>
                        <ha-icon icon="hass:file-tree"></ha-icon>
                      </div>
                    ` : ''}
                  </div>
                  ${isAttrEnabled && hasExtraAttributes ? html`
                    <div class="attr-row">
                      <ha-selector
                        .hass=${this.hass}
                        .selector=${{ attribute: { entity_id: entityId, hide_attributes: baseAttrs } }}
                        .value=${this._getValue(attrKey)}
                        .label="Select Attribute"
                        @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, attrKey)}
                      ></ha-selector>
                    </div>
                  ` : ''}
                </div>`;
              })}
            </div>
          </ha-expansion-panel>
        `)}

        <ha-expansion-panel outlined header="Customize View (Side Columns)">
          <ha-icon slot="header" icon="hass:palette-outline" class="header-icon"></ha-icon>
          <div class="fields-container">
             <div class="side-grid">
                <div class="side-column">
                  <div class="column-title">Left Side</div>
                  ${[1, 2, 3, 4, 5].map(i => this.renderSideEntity(`left${i}`, `Slot Left ${i}`))}
                </div>
                <div class="side-column">
                  <div class="column-title">Right Side</div>
                  ${[1, 2, 3, 4, 5].map(i => this.renderSideEntity(`right${i}`, `Slot Right ${i}`))}
                </div>
             </div>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }

  static styles = css`
    .card-config { display: flex; flex-direction: column; gap: 8px; padding: 12px 0; }
    ha-expansion-panel { border-radius: 8px; --ha-card-border-radius: 8px; }
    .header-icon { color: var(--primary-color); margin-right: 8px; }
    .fields-container { display: flex; flex-direction: column; gap: 16px; padding: 16px; background: var(--card-background-color); }
    .field-row { display: flex; flex-direction: column; gap: 4px; }
    .selector-with-checkbox { display: flex; align-items: center; gap: 8px; }
    .selector-with-checkbox ha-selector { flex-grow: 1; }
    .checkbox-container { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 40px; }
    .checkbox-container ha-icon { --mdc-icon-size: 14px; color: var(--secondary-text-color); }
    .attr-row { padding-left: 20px; border-left: 2px solid var(--primary-color); margin-top: 4px; }
    
    /* Side Columns Styling */
    .side-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .side-column { display: flex; flex-direction: column; gap: 12px; }
    .column-title { font-weight: bold; text-align: center; color: var(--secondary-text-color); border-bottom: 1px solid var(--divider-color); padding-bottom: 4px; }
    .side-entity-box { border: 1px solid var(--divider-color); border-radius: 8px; padding: 10px; background: var(--secondary-background-color); display: flex; flex-direction: column; gap: 8px; }
    .side-entity-header { font-size: 0.8em; font-weight: bold; color: var(--primary-color); }
    .side-row-tools, .threshold-container { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    
    ha-selector { width: 100%; display: block; }
  `;
}

customElements.define('wattpilot-card-editor', WattpilotCardEditor);
