import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import ConnectWallet from './components/ConnectWallet'
import { fetchOutbreakPredictionWithPayment } from './utils/api'

const AquaShieldDashboard: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const { activeAddress, signTransactions } = useWallet()

  const [loading, setLoading] = useState(false)
  const [telemetry, setTelemetry] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Timeline state for staggered reveal
  const [timelineStep, setTimelineStep] = useState<number>(0)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4021'
  const predictionUrl = `${apiBaseUrl}/api/outbreak-prediction`

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const handleRunDiagnostic = async () => {
    if (!activeAddress) {
      setError('Please connect your wallet first')
      return
    }

    if (!signTransactions) {
      setError('Wallet does not support transaction signing')
      return
    }

    setLoading(true)
    setError('')
    setPaymentStatus('')
    setTelemetry(null)
    setIsUnlocked(false)
    setTimelineStep(0)

    try {
      setPaymentStatus('Initiating Agentic Diagnostic...')
      
      const signer = {
        address: activeAddress,
        signTransactions: signTransactions,
      }

      setPaymentStatus('Processing 0.01 USDC x402 payment...')
      const data = await fetchOutbreakPredictionWithPayment(predictionUrl, signer)

      setPaymentStatus('Payment settled via Algorand!')
      setError('') // Clear any previous errors upon success
      setTelemetry(data)
      setIsUnlocked(true)
      setPaymentStatus('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMsg)
      setPaymentStatus('')
      console.error('Diagnostic error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isUnlocked) {
      // Reveal timeline steps with fake delays for effect
      const timers = [
        setTimeout(() => setTimelineStep(1), 100),
        setTimeout(() => setTimelineStep(2), 600),
        setTimeout(() => setTimelineStep(3), 1200),
        setTimeout(() => setTimelineStep(4), 1800)
      ]
      return () => timers.forEach(clearTimeout)
    }
  }, [isUnlocked])

  const renderGauge = (label: string, valueStr: string, percentage: number, colorClass: string, isUnlocked: boolean) => (
    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 shadow-inner">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</div>
        <div className={`text-lg font-bold ${isUnlocked ? 'text-slate-100' : 'text-slate-600'}`}>
          {isUnlocked ? valueStr : '---'}
        </div>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: isUnlocked ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-100 p-4 md:p-8 font-sans bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgkJPGc+CgkJCTxwb2x5Z29uIGZpbGw9IiMxYjJkNCIgb3BhY2l0eT0iLjA1IiBwb2ludHM9IjYwLDAgNjAsNjAgMCw2MCIvPgoJCTwvZz4KCTwvc3ZnPg==')]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_40px_rgba(20,184,166,0.1)] border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 tracking-tight">
                AquaShield AI
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Autonomous Water Safety Command Center</p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300"
              onClick={toggleWalletModal}
            >
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${activeAddress ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                {activeAddress ? `Connected: ${activeAddress.slice(0, 8)}...` : 'Connect Wallet'}
              </span>
            </button>
            {activeAddress && (
              <button
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${
                  loading 
                  ? 'bg-emerald-500/30 text-emerald-200 cursor-not-allowed border border-emerald-500/50' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:shadow-emerald-500/40'
                }`}
                onClick={handleRunDiagnostic}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Diagnostic ($0.01 USDC)
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Metrics Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Probes', value: '142', icon: '📡' },
            { label: 'Protected Pop.', value: '1.2M', icon: '👥' },
            { label: 'System Status', value: isUnlocked ? 'ALERT' : 'NORMAL', icon: '🛡️', color: isUnlocked ? 'text-red-400' : 'text-emerald-400' },
            { label: 'Cost/Diagnostic', value: '$0.01 USDC', icon: '💎' }
          ].map((metric, i) => (
            <div key={i} className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{metric.label}</div>
                <div className={`text-xl font-bold ${metric.color || 'text-slate-200'}`}>{metric.value}</div>
              </div>
              <div className="text-2xl opacity-80">{metric.icon}</div>
            </div>
          ))}
        </div>

        {/* Status / Error Alerts */}
        {paymentStatus && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-4 rounded-xl flex items-center shadow-lg animate-pulse backdrop-blur-md">
            <svg className="w-5 h-5 mr-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-sm tracking-wide">{paymentStatus}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl shadow-lg flex items-center backdrop-blur-md">
            <svg className="w-5 h-5 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Risk Map Card */}
          <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden flex flex-col relative">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
              <h2 className="text-sm font-bold text-slate-200 flex items-center tracking-widest uppercase">
                <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Regional Risk Map
              </h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">COORD: 41.87°N, 87.62°W</span>
              </div>
            </div>
            
            <div className="flex-grow bg-[#0b101a] p-0 relative min-h-[400px] overflow-hidden flex items-center justify-center">
              {/* Animated SVG Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Radar Sweep Animation */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[300px] h-[300px] border border-cyan-500/30 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full border border-cyan-500/20 rounded-full absolute top-0 left-0 scale-75"></div>
                    <div className="w-full h-full border border-cyan-500/10 rounded-full absolute top-0 left-0 scale-50"></div>
                    {/* Sweep */}
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent to-cyan-400 origin-left animate-[spin_2s_linear_infinite]" style={{ transformOrigin: '0 0' }}></div>
                  </div>
                </div>
              )}

              {isUnlocked && telemetry ? (
                <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                  {/* Floating Map Nodes */}
                  <div className="relative w-full h-full">
                    {/* Ward 12 Beacon */}
                    <div className="absolute top-[40%] left-[60%] flex flex-col items-center">
                      <div className="relative">
                        <div className="w-6 h-6 bg-red-500 rounded-full shadow-[0_0_20px_#ef4444] z-20 relative"></div>
                        <div className="w-16 h-16 bg-red-500/40 rounded-full absolute -top-5 -left-5 animate-ping"></div>
                        <div className="w-24 h-24 border border-red-500/30 rounded-full absolute -top-9 -left-9 animate-pulse"></div>
                      </div>
                      <div className="mt-3 bg-red-900/80 border border-red-500/50 px-3 py-1.5 rounded-md backdrop-blur-sm shadow-xl">
                        <div className="text-red-100 font-bold text-xs uppercase tracking-wider">Ward 12</div>
                        <div className="text-red-400 text-[10px] font-mono">CRITICAL RISK</div>
                      </div>
                    </div>

                    {/* Normal Nodes */}
                    <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                    <div className="absolute top-[60%] left-[20%] w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                    <div className="absolute top-[75%] left-[65%] w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                  </div>

                  {/* Floating Risk Breakdown Chart */}
                  <div className="absolute bottom-6 left-6 bg-slate-900/90 border border-slate-700 p-4 rounded-xl backdrop-blur-md shadow-2xl w-64">
                    <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-widest border-b border-slate-700 pb-2">Pathogen Risk Profile</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-red-400 font-medium">Cholera (V. cholerae)</span>
                          <span className="text-slate-300 font-mono">89%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{width: '89%'}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-amber-400 font-medium">Typhoid (S. typhi)</span>
                          <span className="text-slate-300 font-mono">42%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{width: '42%'}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-yellow-400 font-medium">Dysentery (Shigella)</span>
                          <span className="text-slate-300 font-mono">15%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '15%'}}></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                !loading && (
                  <div className="text-slate-500 flex flex-col items-center z-10 bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-800">
                    <svg className="w-12 h-12 mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    <p className="font-medium tracking-wide">Awaiting authorization to generate spatial telemetry</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Visual Sensor Gauges */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-5 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Sensor Telemetry
              </h3>
              
              <div className="space-y-4">
                {renderGauge(
                  'Turbidity (NTU)', 
                  telemetry ? telemetry.waterTurbidity : '', 
                  87, 
                  'bg-gradient-to-r from-yellow-400 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]', 
                  isUnlocked
                )}
                
                {renderGauge(
                  'pH Level', 
                  telemetry ? telemetry.pHLevel : '', 
                  45, 
                  'bg-gradient-to-r from-emerald-400 to-yellow-500', 
                  isUnlocked
                )}

                {renderGauge(
                  'Coliform Count', 
                  telemetry ? telemetry.coliformBacteriaCount : '', 
                  95, 
                  'bg-gradient-to-r from-red-500 to-red-700 shadow-[0_0_10px_rgba(239,68,68,0.8)]', 
                  isUnlocked
                )}
              </div>
            </div>

            {/* Autonomous Agent Activity Log */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-5 flex items-center">
                <svg className="w-4 h-4 mr-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Autonomous Agent Log
              </h3>
              
              <div className="space-y-0 pl-2">
                {[
                  { time: '0.00s', msg: 'HTTP 402 Challenge Issued' },
                  { time: '0.45s', msg: 'On-Chain Micro-settlement Confirmed via Algorand Testnet', highlight: true },
                  { time: '0.70s', msg: 'Anomaly Detection Model Computed' },
                  { time: '0.95s', msg: 'Automated Chlorination Protocol Dispatched to Water Treatment Plant #4', alert: true }
                ].map((log, index) => (
                  <div 
                    key={index} 
                    className={`relative pl-6 pb-4 border-l ${index === 3 ? 'border-transparent' : 'border-slate-700'} transition-all duration-500`}
                    style={{ opacity: timelineStep > index ? 1 : 0, transform: timelineStep > index ? 'translateY(0)' : 'translateY(10px)' }}
                  >
                    <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${log.highlight ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : log.alert ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-500'}`}></div>
                    <div className="text-[10px] font-mono text-slate-400 mb-0.5">[{log.time}]</div>
                    <div className={`text-xs ${log.highlight ? 'text-teal-300 font-medium' : log.alert ? 'text-red-300 font-semibold' : 'text-slate-300'}`}>
                      {log.msg}
                    </div>
                  </div>
                ))}
                
                {timelineStep === 0 && !loading && (
                   <p className="text-sm text-slate-500 italic font-medium py-4">Awaiting diagnostic run...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Lora Link */}
        <div className="text-center pt-6 opacity-70 hover:opacity-100 transition-opacity">
          {activeAddress ? (
            <a 
              href={`https://lora.algokit.io/testnet/account/${activeAddress}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-teal-500 hover:text-teal-400 transition-colors inline-flex items-center text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View your transactions on Lora (Algorand Testnet)
            </a>
          ) : (
            <a 
              href="https://lora.algokit.io/testnet" 
              target="_blank" 
              rel="noreferrer"
              className="text-teal-500 hover:text-teal-400 transition-colors inline-flex items-center text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View transactions on Lora (Algorand Testnet)
            </a>
          )}
        </div>

      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

export default AquaShieldDashboard
