# AquaShield AI 💧🛡️
### Agentic Water-Borne Disease Early Warning System powered by Algorand & x402

AquaShield AI is an autonomous municipal intelligence platform that continuously evaluates real-time water quality telemetry to predict water-borne pathogen outbreaks up to 48 hours before clinical cases emerge. By pairing environmental AI models with Algorand's x402 micropayment standard, AquaShield AI enables public health departments and automated municipal treatment facilities to run low-cost, pay-per-diagnostic pathogen risk assessments without expensive enterprise lock-ins.

---

## 📌 Problem & Motivation

* **Lab Delay Bottlenecks:** Traditional bacterial culture and agar plate testing take 24–48 hours to confirm pathogen spikes (such as Vibrio cholerae or Escherichia coli). By the time contamination is reported, outbreaks have already spread through municipal water grids.
* **Prohibitive SaaS Costs:** Small municipalities and developing health regions cannot afford costly multi-thousand-dollar enterprise software subscriptions to monitor regional water quality.
* **The Solution:** AquaShield AI processes instantaneous optical and physicochemical probe telemetry to generate early warning predictions, monetized via frictionless on-chain micro-transactions ($0.01 USDC) over the Algorand blockchain.

---

## ⚡ Key Features

* 🔬 **Real-Time Pathogen Risk Modeling:** Correlates optical turbidity, pH shifts, and microbial indices to compute regional disease outbreak probability.
* 💳 **HTTP 402 Native Monetization:** Implements the open x402 standard, allowing machines and clients to pay per diagnostic request seamlessly.
* ⚡ **Algorand Instant Settlement:** Micro-payments settle in under 3.5 seconds on Algorand Testnet with negligible transaction fees.
* 🤖 **Autonomous Countermeasure Dispatch:** Automatically generates chlorination dosing protocols and dispatches emergency alerts directly to water treatment plants upon high-risk detection.
* 🗺️ **Interactive Geographic Command Center:** Visualizes live probe coordinates, regional risk heatmaps, and telemetry metric thresholds.

---

## 🧠 Telemetry & Detection Architecture

AquaShield AI evaluates three critical real-time parameters against World Health Organization (WHO) potable water baselines:

| Sensor Metric | Normal Baseline | Alert Condition | Risk Correlation |
| :--- | :--- | :--- | :--- |
| **Turbidity (NTU)** | < 1.0 NTU | > 5.0 NTU | Particulates shield bacteria from UV/chlorine disinfection and foster biofilm growth. |
| **pH Level** | 6.5 - 8.5 | < 6.5 or > 8.5 | Acidic drops indicate organic decomposition or industrial/sewage infiltration. |
| **Coliform Bio-Indicator** | 0 CFU / 100ml | > 100 CFU / 100ml | Confirms direct fecal wastewater contamination and pathogen presence. |

---

## ⛓️ Web3 & x402 Payment Flow

[ Client / Municipal UI ] ---> (1. POST /api/outbreak-prediction) ---> [ x402 Resource Server ]
[ Client / Municipal UI ] <--- (2. HTTP 402: Payment Required) <------ [ x402 Resource Server ]
         |
         +---> (3. Sign $0.01 USDC Tx via Pera Wallet on Algorand Testnet)
         |
[ Client / Municipal UI ] ---> (4. Retry POST + Payment Proof Header) ---> [ x402 Resource Server ]
[ Client / Municipal UI ] <--- (5. HTTP 200: Unlocked Pathogen Report) <-- [ x402 Resource Server ]

1. **Challenge:** When a diagnostic is requested, the server responds with an HTTP 402 Payment Required header detailing price and receiver address.
2. **Settlement:** The client prompts the user to sign a $0.01 USDC asset transfer via Pera Wallet.
3. **Verification:** The GoPlausible facilitator verifies the transaction signature on Algorand Testnet.
4. **Access:** The server executes the prediction model and unlocks the diagnostic report.

---

## 🔗 Verified On-Chain Proof

* **Network:** Algorand Testnet
* **Asset:** Testnet USDC
* **Facilitator:** GoPlausible x402 Facilitator
* **Verified Account Explorer Link:** https://lora.algokit.io/testnet/account/YGPR3HDZOJK6UHSS4WUVH7CCBXEVNX3KDXCHX6IAPDNIDXBDFJDS6W3ZM

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Lucide Icons, @perawallet/connect
* **Backend:** Node.js, Hono, @x402/avm, @algorandfoundation/algokit-utils
* **Blockchain:** Algorand Testnet, ARC-0027 standard
* **Development Environment:** Antigravity IDE

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js v18+
* Pera Wallet mobile app (configured for Algorand Testnet)

### 2. Backend Setup
* `cd x402-demo-server`
* `npm install`
* `npm run dev` (Health check at http://localhost:4021/health)

### 3. Frontend Setup
* `cd X402-Usecase/projects/X402-Usecase`
* `npm install`
* `npx vite` (Runs at http://localhost:5173)

---

## 👥 Team
* **Sesha** ([@Sesha57](https://github.com/Sesha57))
* **Subhiksha** ([@Subhiksha129](https://github.com/Subhiksha129))
* **Rohith** ([@RohithV15](https://github.com/RohithV15))
