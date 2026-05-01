import { useState } from 'react'
import './index.css'
import Drawer from './Drawer'
import { Badge, Marginalia, Panel } from './components'

const INITIAL_JOBS = [
  { id: 'JOB-001', title: 'Haul Excavator to Tofino', client: 'Coastal Logging Co.', location: 'Port Alberni → Tofino', budget: '$1,200', status: 'open', detail: 'Mini-excavator on enclosed trailer. Gate opens 0600. Tight Malahat window — punctual only.' },
  { id: 'JOB-002', title: 'Drone Survey: 80 Acre Vineyard', client: 'Saanich Estates', location: 'Saanich Peninsula', budget: '$2,400', status: 'bidding', detail: 'Full NDVI mapping + orthomosaic. Mavic 3E preferred. No spray residue on property day-of.' },
  { id: 'JOB-003', title: 'Fire Suppression Standby', client: 'BC Wildfire Aux.', location: 'Cowichan Valley', budget: '$3,800', status: 'in_progress', detail: '72-hour standby, skid-mounted unit. ICS check-in 0800 daily.' },
  { id: 'JOB-004', title: 'Emergency Power: Salt Spring', client: 'Salt Spring Co-op', location: 'Salt Spring Island', budget: '$650', status: 'complete', detail: 'Power station + ferry delivery during 14-hour outage.' },
]

const INITIAL_BIDS = [
  { id: 'BID-101', jobId: 'JOB-002', rate: '$2,200', story: "Flew survey on a similar vineyard last harvest. Got home covered in pollen. Worth it.", status: 'submitted' },
]

const CERTS = [
  'Class 1A Commercial Driving',
  'Transport Canada ATPL',
  'Fixed-Wing / Rotary / Land / Sea',
  'Night / IFR / Multi-Engine / Jet / High Performance',
  'Drone Pilot + Ag Drone',
  'Fire Suppression / TDG / First Aid',
  'Security / Forklift / Coastal Shipping',
  'Wilderness Survival',
]

const EQUIPMENT = [
  ['TRUCK',   '2024 Ford EV Lightning Lariat', '5,000 lbs payload'],
  ['AGDRONE', 'DJI Agras T40',                 'Agricultural spray'],
  ['SURVEY',  'DJI Mavic 3 Enterprise',         'NDVI + orthomosaic'],
  ['FPV',     'DJI FPV Drone',                 'Inspection / recon'],
  ['FIRE',    'Fire Suppression Skid',          'Trailer-mounted'],
  ['POWER',   'Power Station + Enclosed Trailer','Emergency / remote'],
]

const SERVICES = ['Hauling','Drone Survey','Ag Drone','Fire Suppression','SAR','Medevac','Security','Equipment Rental','Emergency Power']

export default function App() {
  const [openDrawers, setOpenDrawers] = useState(new Set(['home']))
  const [flash, setFlash]             = useState(null)
  const [jobs, setJobs]               = useState(INITIAL_JOBS)
  const [bids, setBids]               = useState(INITIAL_BIDS)
  const [declareForm, setDeclareForm] = useState({ title: '', location: '', budget: '', detail: '' })
  const [bidForm, setBidForm]         = useState({ jobId: '', rate: '', story: '' })

  const notify = (msg) => { setFlash(msg); setTimeout(() => setFlash(null), 2800) }

  const toggle    = (id) => setOpenDrawers(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const openOne   = (id) => setOpenDrawers(prev => new Set([...prev, id]))

  const openJobs   = jobs.filter(j => j.status === 'open' || j.status === 'bidding')
  const activeJobs = jobs.filter(j => j.status === 'in_progress')
  const doneJobs   = jobs.filter(j => j.status === 'complete')

  const submitDeclare = () => {
    if (!declareForm.title || !declareForm.location) { notify('JOB_TITLE + LOCATION required.'); return }
    const id = `JOB-${String(jobs.length + 1).padStart(3, '0')}`
    setJobs(prev => [{ id, title: declareForm.title, client: '[YOU]', location: declareForm.location, budget: declareForm.budget || 'TBD', status: 'open', detail: declareForm.detail }, ...prev])
    setDeclareForm({ title: '', location: '', budget: '', detail: '' })
    notify(`${id} posted to board.`)
    openOne('bids')
  }

  const submitBid = () => {
    if (!bidForm.jobId || !bidForm.rate || !bidForm.story) { notify('JOB + RATE + STORY all required.'); return }
    const id = `BID-${String(bids.length + 101).padStart(3, '0')}`
    setBids(prev => [{ id, jobId: bidForm.jobId, rate: bidForm.rate, story: bidForm.story, status: 'submitted' }, ...prev])
    setJobs(prev => prev.map(j => j.id === bidForm.jobId ? { ...j, status: 'bidding' } : j))
    setBidForm({ jobId: '', rate: '', story: '' })
    notify(`${id} transmitted.`)
    openOne('mybids')
  }

  const approveBid  = (bid) => {
    setJobs(prev => prev.map(j => j.id === bid.jobId ? { ...j, status: 'in_progress' } : j))
    setBids(prev => prev.map(b => b.id === bid.id ? { ...b, status: 'approved' } : b))
    notify(`${bid.jobId} → IN_PROGRESS`)
  }

  const completeJob = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'complete' } : j))
    notify(`${jobId} → COMPLETE. Good work.`)
  }

  // ── DRAWER CONTENTS ────────────────────────────────────────────────────────

  const HomeContent = () => (
    <div className="space-y-4">
      <Panel>
        <p className="text-green-600 text-xs mb-2">&gt; INCOMING_FEED.dat — Vancouver Island / BC Coast</p>
        <h1 className="text-2xl text-green-400 font-bold crt" style={{ letterSpacing: '0.05em' }}>
          LABOURER WITH ENDURANCE<span className="blink">_</span>
        </h1>
        <p className="text-green-700 mt-1 text-sm">"...and an EV truck."</p>
      </Panel>
      <div className="grid sm:grid-cols-3 gap-3 text-xs text-green-500">
        {[['[01]','Client declares the work'],['[02]','Phoenix bids: rate + story'],['[03]','Client approves → job runs']].map(([n,t]) => (
          <div key={n} className="panel p-3 flex gap-2"><span className="text-green-800">{n}</span><span>{t}</span></div>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        <button className="btn-primary" onClick={() => openOne('declare')}>+ DECLARE_WORK</button>
        <button className="btn-primary" onClick={() => openOne('bids')}>VIEW_OPEN_BIDS</button>
      </div>
      <Marginalia>no middlemen. no platforms. just work getting done.</Marginalia>
    </div>
  )

  const ProfileContent = () => (
    <div className="space-y-4">
      <Panel className="flex items-start gap-4">
        <div className="w-14 h-14 border border-green-400 flex items-center justify-center text-green-400 text-2xl font-bold flex-shrink-0 crt">P</div>
        <div>
          <div className="text-green-400 font-bold text-lg crt">PHOENIX</div>
          <div className="text-green-600 text-xs">Victoria, BC + Vancouver Island / BC Coast</div>
          <div className="text-green-700 text-xs italic mt-1">"Labourer with endurance and an EV truck."</div>
        </div>
      </Panel>
      <Panel>
        <div className="text-green-600 text-xs mb-3 tracking-widest">── CERTIFICATIONS :: CURRENT + VERIFIED ──</div>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {CERTS.map((c,i) => (
            <div key={i} className="flex gap-2 text-xs border-l border-green-800 pl-2 py-0.5">
              <span className="text-green-700 flex-shrink-0">✓</span>
              <span className="text-green-400">{c}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="text-green-600 text-xs mb-3 tracking-widest">── EQUIPMENT ──</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {EQUIPMENT.map(([tag,name,spec]) => (
            <div key={tag} className="flex gap-3 items-start border border-green-900 p-2 hover:border-green-700 transition-colors">
              <span className="label-strip flex-shrink-0">{tag}</span>
              <div>
                <div className="text-green-300 text-xs font-bold">{name}</div>
                <div className="text-green-700 text-xs">{spec}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICES.map(s => (
            <span key={s} className="border border-green-900 text-green-600 px-2 py-0.5 text-xs hover:border-green-600 transition-colors">// {s}</span>
          ))}
        </div>
        <Marginalia>all running. all charged. ready tomorrow morning.</Marginalia>
      </Panel>
    </div>
  )

  const DeclareContent = () => (
    <div className="space-y-3">
      <p className="text-green-700 text-xs">&gt; describe the job. phoenix reads it. phoenix bids. you approve.</p>
      <div>
        <label className="text-green-600 text-xs block mb-1">// JOB_TITLE *</label>
        <input className="inp" value={declareForm.title} onChange={e => setDeclareForm({...declareForm, title: e.target.value})} placeholder="Haul concrete forms to Sooke" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-green-600 text-xs block mb-1">// LOCATION *</label>
          <input className="inp" value={declareForm.location} onChange={e => setDeclareForm({...declareForm, location: e.target.value})} placeholder="Victoria → Sooke" />
        </div>
        <div>
          <label className="text-green-600 text-xs block mb-1">// BUDGET (optional)</label>
          <input className="inp" value={declareForm.budget} onChange={e => setDeclareForm({...declareForm, budget: e.target.value})} placeholder="$500" />
        </div>
      </div>
      <div>
        <label className="text-green-600 text-xs block mb-1">// DETAIL</label>
        <textarea className="inp" rows={4} value={declareForm.detail} onChange={e => setDeclareForm({...declareForm, detail: e.target.value})} placeholder="Weight. Timing. Special access or equipment notes..." />
      </div>
      <button className="btn-primary w-full py-2" onClick={submitDeclare}>POST_TO_BOARD →</button>
      <Marginalia>be specific. specifics save fuel and arguments.</Marginalia>
    </div>
  )

  const BidsContent = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-green-600 text-xs">&gt; {openJobs.length} job(s) on the board.</p>
        <button className="btn-sm" onClick={() => openOne('declare')}>+ DECLARE</button>
      </div>
      {openJobs.length === 0 && <Panel className="text-center text-green-700 text-sm">// quiet on the wire.</Panel>}
      {openJobs.map(job => (
        <div key={job.id} className="panel p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <div className="text-green-800 text-xs">{job.id}</div>
              <div className="text-green-400 font-bold">{job.title}</div>
            </div>
            <Badge status={job.status} />
          </div>
          <div className="text-xs space-y-0.5 text-green-600 mb-3">
            <div>// CLIENT: <span className="text-green-400">{job.client}</span></div>
            <div>// LOCATION: <span className="text-green-400">{job.location}</span></div>
            <div>// BUDGET: <span className="text-green-400">{job.budget}</span></div>
          </div>
          {job.detail && <p className="text-green-800 text-xs border-l border-green-900 pl-2 italic mb-3">{job.detail}</p>}
          <button className="btn-sm" onClick={() => { setBidForm({jobId: job.id, rate: '', story: ''}); openOne('submitbid') }}>
            SUBMIT_BID →
          </button>
        </div>
      ))}
    </div>
  )

  const SubmitBidContent = () => (
    <div className="space-y-3">
      <p className="text-green-700 text-xs">&gt; rate without a story is just a number. story without a rate is just a yarn.</p>
      <div>
        <label className="text-green-600 text-xs block mb-1">// JOB_ID *</label>
        <select className="inp" value={bidForm.jobId} onChange={e => setBidForm({...bidForm, jobId: e.target.value})}>
          <option value="">-- select job --</option>
          {jobs.filter(j => j.status==='open'||j.status==='bidding').map(j => (
            <option key={j.id} value={j.id}>{j.id} :: {j.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-green-600 text-xs block mb-1">// RATE *</label>
        <input className="inp" value={bidForm.rate} onChange={e => setBidForm({...bidForm, rate: e.target.value})} placeholder="$1,100" />
      </div>
      <div>
        <label className="text-green-600 text-xs block mb-1">// STORY * — why you, why this, why now</label>
        <textarea className="inp" rows={5} value={bidForm.story} onChange={e => setBidForm({...bidForm, story: e.target.value})} placeholder="Hauled a similar load through the Malahat last month. Knew every switchback. Got it there dry at sunrise." />
        <div className="mt-1"><Marginalia>a story is how a client knows you'll show up.</Marginalia></div>
      </div>
      <button className="btn-primary w-full py-2" onClick={submitBid}>TRANSMIT_BID →</button>
    </div>
  )

  const MyBidsContent = () => (
    <div className="space-y-3">
      <p className="text-green-600 text-xs">&gt; tracking {bids.length} bid(s).</p>
      {bids.length === 0 && <Panel className="text-center text-green-700 text-sm">// no bids yet.</Panel>}
      {bids.map(bid => {
        const job = jobs.find(j => j.id === bid.jobId)
        return (
          <div key={bid.id} className="panel p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <div className="text-green-800 text-xs">{bid.id} → {bid.jobId}</div>
                <div className="text-green-400 font-bold text-sm">{job?.title || '(unknown)'}</div>
              </div>
              <Badge status={bid.status} />
            </div>
            <div className="text-green-300 text-sm mb-2">RATE: <span className="font-bold">{bid.rate}</span></div>
            <div className="text-green-600 text-xs italic border-l border-green-800 pl-2 mb-3">"{bid.story}"</div>
            {job?.status === 'bidding' && bid.status === 'submitted' && (
              <button className="btn-warn" onClick={() => approveBid(bid)}>[SIM] CLIENT_APPROVES →</button>
            )}
          </div>
        )
      })}
    </div>
  )

  const ActiveContent = () => (
    <div className="space-y-4">
      <div>
        <div className="text-green-700 text-xs mb-2 tracking-widest">── IN_PROGRESS ──</div>
        {activeJobs.length === 0
          ? <Panel className="text-center text-green-800 text-sm">// nothing running.</Panel>
          : activeJobs.map(j => (
            <div key={j.id} className="panel p-3 mb-2 flex justify-between items-center gap-3 flex-wrap">
              <div>
                <div className="text-cyan-300 text-sm font-bold">{j.title}</div>
                <div className="text-green-700 text-xs">{j.id} :: {j.location}</div>
              </div>
              <button className="btn-cyan" onClick={() => completeJob(j.id)}>MARK_COMPLETE ✓</button>
            </div>
          ))
        }
      </div>
      <div>
        <div className="text-green-900 text-xs mb-2 tracking-widest">── ARCHIVE ──</div>
        {doneJobs.length === 0
          ? <Panel className="text-center text-green-900 text-sm">// archive empty.</Panel>
          : doneJobs.map(j => (
            <div key={j.id} className="p-2 mb-1 flex justify-between items-center opacity-40">
              <div>
                <div className="text-gray-500 line-through text-xs">{j.title}</div>
                <div className="text-green-900 text-xs">{j.id}</div>
              </div>
              <span className="text-green-700 text-xs">✓</span>
            </div>
          ))
        }
      </div>
    </div>
  )

  const drawers = [
    { id: 'home',      number: 1, label: 'HOME',          sublabel: '// landing + protocol',      badge: null,
      content: <HomeContent /> },
    { id: 'profile',   number: 2, label: 'OPERATOR_FILE', sublabel: '// certs + equipment',        badge: null,
      content: <ProfileContent /> },
    { id: 'declare',   number: 3, label: 'DECLARE_WORK',  sublabel: '// post a job',               badge: null,
      content: <DeclareContent /> },
    { id: 'bids',      number: 4, label: 'OPEN_BIDS',     sublabel: '// jobs awaiting operator',   badge: <span className="text-green-600 text-xs">{openJobs.length} open</span>,
      content: <BidsContent /> },
    { id: 'submitbid', number: 5, label: 'SUBMIT_BID',    sublabel: '// rate + story',             badge: null,
      content: <SubmitBidContent /> },
    { id: 'mybids',    number: 6, label: 'MY_BIDS',       sublabel: '// track transmissions',      badge: <span className="text-green-600 text-xs">{bids.length} total</span>,
      content: <MyBidsContent /> },
    { id: 'active',    number: 7, label: 'ACTIVE_JOBS',   sublabel: '// in progress + archive',    badge: activeJobs.length > 0 ? <span className="text-cyan-400 text-xs">{activeJobs.length} active</span> : null,
      content: <ActiveContent /> },
  ]

  return (
    <div className="min-h-screen scanlines py-8 px-4">

      {flash && <div className="flash">&gt; {flash}</div>}

      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-3 flex items-end justify-between">
        <div>
          <div className="text-green-400 text-lg font-bold crt tracking-widest">PHOENIX</div>
          <div className="text-green-800 text-xs">Victoria, BC — Vancouver Island + BC Coast</div>
        </div>
        <div className="text-right">
          <div className="text-green-700 text-xs">BID.BOARD.TERMINAL</div>
          <div className="flex items-center gap-1.5 justify-end mt-0.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-700 text-xs">ONLINE</span>
          </div>
        </div>
      </div>

      {/* CABINET */}
      <div className="max-w-2xl mx-auto cabinet">
        <div className="border-b-2 border-green-700 px-5 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(180deg, #0d1a0d 0%, #080f08 100%)' }}>
          <div className="text-green-500 text-xs tracking-widest">LABOURER//ENDURANCE :: FILE CABINET v1.0</div>
          <div className="text-green-800 text-xs">VIC.BC.CA<span className="blink">_</span></div>
        </div>

        {drawers.map(d => (
          <Drawer key={d.id} {...d} isOpen={openDrawers.has(d.id)} onToggle={toggle}>
            {d.content}
          </Drawer>
        ))}

        <div className="border-t border-green-900 px-5 py-3 text-center"
          style={{ background: 'linear-gradient(180deg, #080f08 0%, #050a05 100%)' }}>
          <p className="text-green-900 text-xs italic">"every panel is a frame. every frame is a job. every job is a story." — UC</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-3 text-center">
        <span className="text-green-900 text-xs">// built on the road. signed: PHOENIX. //</span>
      </div>
    </div>
  )
}
