# ⚡ Fronius Wattpilot Card
**The most advanced and customizable charging card for Fronius Wattpilot in Home Assistant.**

[![GitHub Release](https://img.shields.io/github/v/release/jacek2511/wattpilot-card?style=flat-square)](https://github.com/YOUR_USERNAME/wattpilot-card/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange?style=flat-square)](https://hacs.xyz/)
[![Node.js 24](https://img.shields.io/badge/Node.js-24-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/jacek2511/wattpilot-card?style=flat-square)](LICENSE)

The **Fronius Wattpilot Card** provides a sleek, interactive interface to monitor and control your electric vehicle charging. It mimics the physical LED ring of the Wattpilot while adding deep integration for PV surplus, smart pricing, and vehicle battery status.

---

## ⚠️ Prerequisites / Wymagania
This card is a frontend representation and **requires** the following integration to be installed and configured in Home Assistant:

* **[Fronius Wattpilot-HA](https://github.com/mk-maddin/wattpilot-HA)** by *mk-maddin*. 
    *(Without this integration, the card will not have access to the necessary sensors and controls).*

---
## ✨ Key Features
* **Intuitive LED Ring**: Animated 32-LED ring reflecting real-time charging status, power levels, and phase count.
* **Dual Sidebar Columns**: Up to 10 customizable slots (5 left, 5 right) for any HA entity with dynamic color rules.
* **Smart Charging Integration**: One-tap access to Eco and Next Trip modes, PV surplus toggles, and price limits.
* **Advanced UI Editor**: Full visual editor support for easy entity mapping without touching YAML.

---

## 🚀 Installation

### 1. Via HACS (Recommended)
1.  Ensure [HACS](https://hacs.xyz/) is installed.
2.  Go to **HACS** > **Frontend**.
3.  Click the **three dots** in the top right corner and select **Custom repositories**.
4.  Add URL: `https://github.com/jacek2511/wattpilot-card`
5.  Select **Lovelace** as the category and click **Add**.
6.  Find **Wattpilot Card** in the list and click **Download**.

### 2. Manual Installation
1.  Download the `wattpilot-card.js.gz` from the [Latest Release](https://github.com/jacek2511/wattpilot-card/releases).
2.  Extract the `wattpilot-card.js` and place it in your `/config/www/community/wattpilot-card/` folder.
3.  Add the following resource to your Dashboard:
    * **URL:** `/local/community/wattpilot-card/wattpilot-card.js`
    * **Type:** `module`

---

## 🛠 Configuration
The card is best configured using the **Visual Editor**. Simply add the card to your dashboard and use the UI to link your entities.

### Advanced YAML Example
```yaml
type: custom:wattpilot-card
name: Home Charger
entity_status: sensor.wattpilot_car_state
entity_power: sensor.wattpilot_power
entity_current: number.wattpilot_charging_current
entity_mode: select.wattpilot_mode
entity_soc: sensor.car_soc
entity_pv_surplus: switch.wattpilot_pv_surplus

# Custom Sidebar Example
left1:
  entity: sensor.grid_export
  icon: mdi:transmission-tower
  color_rules:
    - value: 0
      color: "#22c55e"
    - value: 5000
      color: "#ef4444"
