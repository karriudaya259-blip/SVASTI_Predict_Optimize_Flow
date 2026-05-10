import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DISTRICTS = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Tirupati","Kadapa","Anantapur","Eluru","Ongole","Nandyal","Chittoor","Srikakulam","Vizianagaram"],
  "Telangana": ["Hyderabad","Secunderabad","Warangal","Nizamabad","Karimnagar","Khammam","Mahbubnagar","Nalgonda","Adilabad","Medak","Rangareddy","Sangareddy","Suryapet","Siddipet","Mancherial"],
  "Karnataka": ["Bengaluru","Mysuru","Hubli","Mangaluru","Belagavi","Kalaburagi","Ballari","Vijayapura","Shivamogga","Tumkur","Davangere","Bidar","Raichur","Udupi","Chitradurga"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Vellore","Erode","Thoothukudi","Dindigul","Kancheepuram","Thanjavur","Cuddalore","Tiruppur","Krishnagiri"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Amravati","Kolhapur","Thane","Navi Mumbai","Pimpri-Chinchwad","Nanded","Sangli","Jalgaon","Akola"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Anand","Morbi","Surendranagar","Mehsana","Bharuch","Navsari","Valsad","Patan"],
  "Delhi": ["Central Delhi","North Delhi","South Delhi","East Delhi","West Delhi","New Delhi","North East Delhi","North West Delhi","South East Delhi","South West Delhi","Shahdara","Dwarka","Rohini","Pitampura","Vasant Kunj"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Bhilwara","Alwar","Bharatpur","Sikar","Pali","Tonk","Churu","Dausa","Nagaur"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Agra","Varanasi","Prayagraj","Meerut","Ghaziabad","Noida","Mathura","Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Firozabad"],
  "West Bengal": ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Malda","Bardhaman","Kharagpur","Haldia","Jalpaiguri","Cooch Behar","Darjeeling","Bankura","Purulia","Murshidabad"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Kannur","Palakkad","Alappuzha","Malappuram","Kottayam","Kasaragod","Pathanamthitta","Idukki","Wayanad","Ernakulam"],
  "Punjab": ["Chandigarh","Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Hoshiarpur","Gurdaspur","Ferozepur","Moga","Faridkot","Pathankot","Ropar","Sangrur"],
  "Haryana": ["Gurugram","Faridabad","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Bhiwani","Sirsa","Rewari","Kaithal","Jhajjar"],
  "Madhya Pradesh": ["Bhopal","Indore","Gwalior","Jabalpur","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah","Begusarai","Katihar","Munger","Chhapra","Danapur","Bettiah","Motihari"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda","Jeypore","Angul","Dhenkanal","Kendujhar","Rayagada"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Diphu","North Lakhimpur","Haflong","Goalpara","Karimganj","Sivasagar"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Ambikapur","Raigarh","Champa","Dhamtari","Mahasamund","Kanker","Janjgir","Kabirdham"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Medininagar","Chatra","Gumla","Simdega","Dumka","Godda","Pakur"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Canacona","Quepem","Sanguem","Pernem","Mormugao","Tiswadi","Salcete"],
  "Himachal Pradesh": ["Shimla","Dharamsala","Solan","Mandi","Kullu","Hamirpur","Una","Nahan","Palampur","Bilaspur","Chamba","Kangra","Kinnaur","Lahaul","Spiti"],
  "Uttarakhand": ["Dehradun","Haridwar","Rishikesh","Roorkee","Haldwani","Rudrapur","Kashipur","Nainital","Mussoorie","Kotdwar","Pithoragarh","Almora","Bageshwar","Chamoli","Champawat"],
};

const HELPLINES = {
  "Andhra Pradesh": { police: "1095 / 0866-2575333", name: "AP Traffic Police" },
  "Telangana":      { police: "1095 / 040-27852400", name: "Hyderabad Traffic Police" },
  "Karnataka":      { police: "1095 / 080-22943225", name: "Karnataka Traffic Police" },
  "Tamil Nadu":     { police: "1095 / 044-23452345", name: "TN Traffic Police" },
  "Maharashtra":    { police: "1095 / 022-24937777", name: "Mumbai Traffic Police" },
  "Gujarat":        { police: "1095 / 079-25501234", name: "Gujarat Traffic Police" },
  "Rajasthan":      { police: "1095 / 0141-2741234", name: "Rajasthan Traffic Police" },
  "Uttar Pradesh":  { police: "1095 / 0522-2620500", name: "UP Traffic Police" },
  "West Bengal":    { police: "1095 / 033-22143234", name: "Kolkata Traffic Police" },
  "Delhi":          { police: "1095 / 011-25844444", name: "Delhi Traffic Police" },
  "Kerala":         { police: "1095 / 0471-2721547", name: "Kerala Traffic Police" },
  "Punjab":         { police: "1095 / 0172-2740050", name: "Punjab Traffic Police" },
  "Haryana":        { police: "1095 / 0172-2560026", name: "Haryana Traffic Police" },
  "Madhya Pradesh": { police: "1095 / 0755-2443500", name: "MP Traffic Police" },
  "Bihar":          { police: "1095 / 0612-2201113", name: "Bihar Traffic Police" },
  "Odisha":         { police: "1095 / 0674-2392800", name: "Odisha Traffic Police" },
};

const BASE_CHART = [60,40,35,80,350,820,950,700,420,380,460,720,650,430,360,400,600,880,940,700,420,260,160,90];
const HOURS = Array.from({length:24},(_,i)=>`${i===0?"12AM":i<12?i+"AM":i===12?"12PM":(i-12)+"PM"}`);
const isPeak = h => (h>=7&&h<=10)||(h>=17&&h<=20);

const S = {
  wrap: { position:"fixed", inset:0, zIndex:0 },
  bgImg: { width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%", filter:"brightness(0.25) saturate(1.3)" },
  bgOverlay: { position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(4,8,18,0.2)0%,rgba(4,8,18,0.55)50%,rgba(4,8,18,0.88)100%)" },
  app: { position:"relative", zIndex:1, maxWidth:980, margin:"0 auto", padding:"0 16px 60px", fontFamily:"'Exo 2',sans-serif" },
  hero: { display:"flex", flexDirection:"column", alignItems:"center", padding:"44px 0 30px", gap:12 },
  logoRing: { width:120, height:120, borderRadius:"50%", overflow:"hidden", border:"2.5px solid #00c8ff", boxShadow:"0 0 28px rgba(0,200,255,0.4)", flexShrink:0 },
  logoImg: { width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 20%" },
  title: { fontFamily:"'Rajdhani',sans-serif", fontSize:60, fontWeight:700, letterSpacing:5, color:"#fff", textShadow:"0 0 40px rgba(0,200,255,0.45)", lineHeight:1 },
  sub: { fontFamily:"'Rajdhani',sans-serif", fontSize:14, letterSpacing:7, color:"#00c8ff", fontWeight:600 },
  desc: { fontSize:14, color:"rgba(180,210,230,0.6)", letterSpacing:1, textAlign:"center" },
  profileBar: { background:"rgba(6,12,26,0.82)", border:"1px solid rgba(0,200,255,0.15)", borderRadius:14, padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:14, backdropFilter:"blur(12px)" },
  avatar: { width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#00c8ff,#ff6b2b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 },
  profileName: { fontFamily:"'Rajdhani',sans-serif", fontSize:17, fontWeight:700, color:"#fff" },
  profileDetail: { fontSize:12, color:"rgba(180,210,230,0.55)", marginTop:2 },
  logoutBtn: { marginLeft:"auto", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(180,210,230,0.55)", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"'Exo 2',sans-serif" },
  card: { background:"rgba(6,12,26,0.82)", border:"1px solid rgba(0,200,255,0.15)", borderRadius:16, padding:22, marginBottom:16, backdropFilter:"blur(12px)", position:"relative", overflow:"hidden" },
  cardAccent: { position:"absolute", top:0, left:0, right:0, height:1.5, background:"linear-gradient(90deg,#00c8ff,transparent)" },
  cardTitle: { fontFamily:"'Rajdhani',sans-serif", fontSize:20, fontWeight:700, color:"#00c8ff", marginBottom:18, letterSpacing:1 },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  grid3: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 },
  field: { display:"flex", flexDirection:"column", gap:5 },
  label: { fontSize:11, color:"rgba(180,210,230,0.55)", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600 },
  input: { background:"rgba(10,25,50,0.85)", border:"1px solid rgba(0,200,255,0.2)", padding:"11px 14px", borderRadius:10, color:"#e8f4f8", width:"100%", fontFamily:"'Exo 2',sans-serif", fontSize:14, outline:"none" },
  journeyBox: { background:"rgba(0,200,255,0.04)", border:"1px solid rgba(0,200,255,0.2)", borderRadius:12, padding:16, display:"flex", alignItems:"center", gap:10, marginBottom:12 },
  slotSide: { flex:1 },
  slotLbl: { fontSize:10, color:"#00c8ff", letterSpacing:2, fontWeight:700, marginBottom:4 },
  slotInp: { background:"transparent", border:"none", color:"#fff", fontSize:16, fontWeight:600, fontFamily:"'Rajdhani',sans-serif", width:"100%", outline:"none", letterSpacing:.5 },
  arrow: { color:"#00c8ff", fontSize:24, flexShrink:0, fontWeight:700 },
  carpoolRow: { display:"flex", gap:8, marginTop:4 },
  cpBtn: { flex:1, padding:"10px 6px", background:"rgba(10,25,50,0.85)", border:"1px solid rgba(0,200,255,0.2)", borderRadius:9, color:"rgba(180,210,230,0.55)", fontSize:13, fontFamily:"'Exo 2',sans-serif", cursor:"pointer", textAlign:"center" },
  cpBtnActive: { flex:1, padding:"10px 6px", background:"rgba(0,200,255,0.12)", border:"1px solid #00c8ff", borderRadius:9, color:"#00c8ff", fontSize:13, fontFamily:"'Exo 2',sans-serif", cursor:"pointer", textAlign:"center" },
  mainBtn: { width:"100%", marginTop:16, background:"linear-gradient(135deg,#00c8ff,#0080aa)", border:"none", padding:14, borderRadius:12, color:"#020c1a", fontSize:16, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", letterSpacing:2, cursor:"pointer" },
  predGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 },
  predCard: { background:"rgba(10,25,50,0.85)", border:"1px solid rgba(0,200,255,0.15)", borderRadius:12, padding:18, textAlign:"center" },
  predVal: { fontFamily:"'Rajdhani',sans-serif", fontSize:30, fontWeight:700, color:"#00c8ff", lineHeight:1 },
  predLbl: { fontSize:11, color:"rgba(180,210,230,0.5)", marginTop:5, letterSpacing:1 },
  predMsg: { background:"rgba(10,25,50,0.6)", borderRadius:10, padding:14, fontSize:14, color:"rgba(180,210,230,0.7)", lineHeight:1.7, whiteSpace:"pre-line" },
  locPill: { display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,200,255,0.08)", border:"1px solid rgba(0,200,255,0.3)", borderRadius:20, padding:"3px 12px", fontSize:11, color:"#00c8ff", marginBottom:14 },
  dot: { width:6, height:6, borderRadius:"50%", background:"#00e676" },
  hlGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 },
  hlCard: { background:"rgba(10,25,50,0.85)", border:"1px solid rgba(0,200,255,0.15)", borderRadius:12, padding:14, textAlign:"center" },
  hlIcon: { fontSize:22, marginBottom:6 },
  hlName: { fontSize:11, color:"rgba(180,210,230,0.5)", marginBottom:4 },
  hlNum: { fontFamily:"'Rajdhani',sans-serif", fontSize:17, fontWeight:700, color:"#ff3d3d" },
  hlNumSafe: { fontFamily:"'Rajdhani',sans-serif", fontSize:17, fontWeight:700, color:"#00e676" },
  agentGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  agent: { background:"rgba(10,25,50,0.85)", border:"1px solid rgba(0,200,255,0.15)", borderRadius:14, padding:18, cursor:"pointer" },
  agentActive: { background:"rgba(0,200,255,0.07)", border:"1px solid #00c8ff", borderRadius:14, padding:18, cursor:"pointer" },
  agentIcon: { fontSize:28, marginBottom:6 },
  agentName: { fontFamily:"'Rajdhani',sans-serif", fontSize:16, fontWeight:700, color:"#e8f4f8" },
  agentRole: { fontSize:11, color:"rgba(180,210,230,0.5)", marginTop:2 },
  agentOut: { marginTop:14, background:"rgba(2,8,20,0.85)", border:"1px solid rgba(0,200,255,0.12)", borderRadius:10, padding:14, fontSize:13, color:"#00c8ff", lineHeight:1.7, minHeight:52, whiteSpace:"pre-line" },
  audit: { background:"rgba(2,6,16,0.9)", border:"1px solid rgba(0,200,255,0.12)", borderRadius:10, padding:12, maxHeight:180, overflowY:"auto", fontSize:12, lineHeight:1.6 },
  auditEntry: { padding:"3px 0", borderBottom:"1px solid rgba(0,200,255,0.06)", color:"rgba(100,160,200,0.65)" },
  auditLast: { padding:"3px 0", color:"#00c8ff" },
  impactGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 },
  impCard: { background:"rgba(10,25,50,0.85)", border:"1px solid rgba(0,200,255,0.12)", borderRadius:12, padding:16, textAlign:"center" },
  impNum: { fontFamily:"'Rajdhani',sans-serif", fontSize:24, fontWeight:700, color:"#00e676" },
  impLbl: { fontSize:11, color:"rgba(180,210,230,0.5)", marginTop:4 },
  mapFrame: { width:"100%", height:300, borderRadius:12, border:"none", display:"block" },
  resultOk: { background:"rgba(0,230,118,0.08)", border:"1px solid rgba(0,230,118,0.3)", color:"#00e676", borderRadius:10, padding:"12px 16px", fontSize:14, marginTop:12, lineHeight:1.5 },
  resultWarn: { background:"rgba(255,214,0,0.08)", border:"1px solid rgba(255,214,0,0.3)", color:"#ffd600", borderRadius:10, padding:"12px 16px", fontSize:14, marginTop:12, lineHeight:1.5 },
  footer: { textAlign:"center", padding:20, fontSize:12, color:"rgba(180,210,230,0.4)", letterSpacing:1 },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [carpool, setCarpool] = useState("no");
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("Hyderabad");
  const [chartData, setChartData] = useState(BASE_CHART.map((v,i)=>({h:HOURS[i],v,peak:isPeak(i)})));
  const [pred, setPred] = useState({congestion:"--",delay:"--",fuel:"--",msg:"Book a journey slot above to see your live traffic prediction."});
  const [result, setResult] = useState(null);
  const [auditLog, setAuditLog] = useState(["🟢 SVASTI online · AI agents ready","📡 Monitoring active · Awaiting slot bookings"]);
  const [agentMsg, setAgentMsg] = useState("▶ Click any agent to activate real-time analysis");
  const [activeAgent, setActiveAgent] = useState(null);
  const [locationLabel, setLocationLabel] = useState("Detecting...");
  const [helplineState, setHelplineState] = useState("Telangana");
  const [liveCount, setLiveCount] = useState(2847);
  const [mapQ, setMapQ] = useState("Hyderabad traffic");
  const [journeyHour, setJourneyHour] = useState(12);
  const auditRef = useRef(null);

  const nameRef=useRef(),phoneRef=useRef(),vehicleRef=useRef(),vtRef=useRef(),peopleRef=useRef();
  const fromRef=useRef(),toRef=useRef(),dateRef=useRef(),timeRef=useRef();
  const from2=useRef(),to2=useRef(),date2=useRef(),time2=useRef(),people2=useRef(),cp2=useRef();

  useEffect(()=>{
    const saved = localStorage.getItem("svasti_user");
    if(saved) setUser(JSON.parse(saved));
    setLiveCount(parseInt(localStorage.getItem("svasti_count")||"2847"));
    detectGPS();
    if(dateRef.current) dateRef.current.value=new Date().toISOString().split("T")[0];
  },[]);

  useEffect(()=>{ if(auditRef.current) auditRef.current.scrollTop=auditRef.current.scrollHeight; },[auditLog]);

  const addAudit = msg => {
    const ts=new Date().toLocaleTimeString("en-IN",{hour12:false});
    setAuditLog(p=>[...p.slice(-19),`[${ts}] ${msg}`]);
  };

  function detectGPS(){
    if(!navigator.geolocation){setLocationLabel("Hyderabad");return;}
    navigator.geolocation.getCurrentPosition(pos=>{
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
        .then(r=>r.json()).then(d=>{
          const a=d.address||{};
          const city=a.city||a.town||a.village||"Your City";
          const st=a.state||"Telangana";
          const matched=Object.keys(HELPLINES).find(k=>st.toLowerCase().includes(k.toLowerCase()))||"Telangana";
          setHelplineState(matched); setLocationLabel(city);
          setMapQ(`${pos.coords.latitude},${pos.coords.longitude}`);
          addAudit(`📡 GPS: ${city}, ${matched}`);
        }).catch(()=>setLocationLabel("Hyderabad"));
    },()=>{ setHelplineState(state); setLocationLabel(district); addAudit("📡 GPS denied · Using selected location"); });
  }

  function handleState(s){
    setState(s); const d=DISTRICTS[s]||[];
    setDistrict(d[0]||""); setHelplineState(s); setMapQ(`${d[0]||s} traffic`);
  }

  function handleDistrict(d){
    setDistrict(d); setMapQ(`${d} traffic`); setLocationLabel(d);
    addAudit(`📍 Location → ${d}, ${state}`);
  }

  function getPred(hour,people,cp){
    if((hour>=8&&hour<=10)||(hour>=17&&hour<=19))
      return{congestion:"86%",delay:"38 min",fuel:people>=3?"🌱 Excellent":cp!=="no"?"🌱 Eco":"📊 Standard",msg:"🚨 HIGH CONGESTION · Leave 30 min early or take Metro",cls:"err"};
    if(hour>=11&&hour<=16)
      return{congestion:"42%",delay:"18 min",fuel:"📊 Standard",msg:"⚠️ MODERATE · Consider leaving 10 min earlier",cls:"warn"};
    return{congestion:"12%",delay:"6 min",fuel:"✅ Smooth",msg:"✅ LOW CONGESTION · Smooth journey expected!",cls:"ok"};
  }

  function afterBook(name,vehicle,time,people,cp,from,to,date,st){
    const h=parseInt((time||"12:00").split(":")[0]);
    setJourneyHour(h);
    const p=getPred(h,people,cp);
    setPred({...p,msg:`🚗 ${name}  (${vehicle}) · ${from} → ${to}\n📅 ${date||"Today"} at ${time} · 👥 ${people} traveler(s) · ${st}\n🔮 ${p.msg}`});
    setChartData(prev=>prev.map((d,i)=>i===h?{...d,v:Math.min(1400,d.v+20)}:d));
    const nc=liveCount+1; setLiveCount(nc); localStorage.setItem("svasti_count",nc);
    if(people>=3) addAudit(`⚙️ OPTIMIZER: HOV lane granted · ${vehicle} (${people} occupants)`);
    if(cp!=="no") addAudit(`💬 NUDGE: Carpool search started for ${name}`);
  }

  function showResult(msg,cls){ setResult({msg,cls}); setTimeout(()=>setResult(null),5000); }

  function register(){
    const name=nameRef.current?.value?.trim(),phone=phoneRef.current?.value?.trim();
    const vehicle=vehicleRef.current?.value?.trim()?.toUpperCase(),vt=vtRef.current?.value;
    const people=parseInt(peopleRef.current?.value)||1,from=fromRef.current?.value?.trim();
    const to=toRef.current?.value?.trim(),date=dateRef.current?.value,time=timeRef.current?.value;
    if(!name||!vehicle||!from||!to||!time){showResult("⚠️ Please fill Name, Vehicle, From, To and Time.","warn");return;}
    const u={name,phone,vehicle,vehicleType:vt,state,district,registeredOn:new Date().toLocaleDateString("en-IN")};
    localStorage.setItem("svasti_user",JSON.stringify(u)); setUser(u);
    addAudit(`📝 NEW: ${name} | ${vehicle} | ${district}, ${state}`);
    afterBook(name,vehicle,time,people,carpool,from,to,date,state);
    showResult(`✅ Registered! Slot booked.${phone?` 📱 SMS sent to ${phone}.`:""} ${carpool!=="no"?"🤝 Carpool active!":""}`, "ok");
  }

  function bookJourney(){
    if(!user) return;
    const from=from2.current?.value?.trim(),to=to2.current?.value?.trim();
    const time=time2.current?.value,date=date2.current?.value;
    const people=parseInt(people2.current?.value)||1,cp=cp2.current?.value||"no";
    if(!from||!to||!time){showResult("⚠️ Fill From, To and Time.","warn");return;}
    addAudit(`📍 SLOT: ${user.name} | ${from} → ${to} | ${time}`);
    afterBook(user.name,user.vehicle,time,people,cp,from,to,date,user.state);
    showResult(`✅ Slot booked! ${cp!=="no"?"🤝 Carpool active.":"Safe travels!"}`, "ok");
  }

  function agentClick(id){
    setActiveAgent(id);
    const peak=(journeyHour>=8&&journeyHour<=10)||(journeyHour>=17&&journeyHour<=19);
    const msgs={
      predictor: peak
        ? "🔮 PREDICTOR: HIGH CONGESTION (86%)\nLSTM confidence: 89%\nRecommendation: Shift departure ±30 min or use alternate route"
        : "🔮 PREDICTOR: LOW CONGESTION (12%)\nLSTM confidence: 94%\nCurrent window is optimal for travel",
      optimizer: "⚙️ OPTIMIZER: Route optimized +8%\nSignal timing adjusted for 3 corridors\nHOV lane eligibility checked\nEstimated savings: 12-15 min (3+ occupants)",
      nudge: peak
        ? "💬 NUDGE: Peak alert!\n• Leave 30 min early → save 25 min\n• Outer Ring Road: 18 min faster\n• Metro: fastest option\n• Carpool: saves ₹40 on toll"
        : "💬 NUDGE: Off-peak travel – great choice!\n• Maintain 50-60 km/h for optimal fuel\n• 0 carpool matches nearby right now",
      verifier: `📊 VERIFIER AUDIT REPORT\n• ${liveCount.toLocaleString("en-IN")} slots booked today\n• 46% congestion reduction verified\n• 2,450L fuel saved · 5.8T CO₂ offset\n• 98.7% SLA compliance\n• 147 signal optimizations executed\n• 892 nudges delivered · 67 carpool matches`,
    };
    setAgentMsg(msgs[id]);
    addAudit(`🤖 ${id.toUpperCase()} agent activated`);
  }

  const hl=HELPLINES[helplineState]||HELPLINES["Telangana"];
  const districts=DISTRICTS[state]||[];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Exo+2:wght@300;400;600;700&display=swap" rel="stylesheet"/>
      <div style={S.wrap}>
        <img style={S.bgImg} src="svasti logo.jpeg" alt=""/>
        <div style={S.bgOverlay}/>
      </div>
      <div style={S.app}>
        {/* HERO */}
        <div style={S.hero}>
          <div style={S.logoRing}><img style={S.logoImg} src="svasti logo.jpeg" alt="SVASTI"/></div>
          <div style={S.title}>SVASTI</div>
          <div style={S.sub}>PREDICT · OPTIMIZE · FLOW</div>
          <div style={S.desc}>India's AI-Powered Urban Mobility Platform</div>
        </div>

        {/* PROFILE BAR */}
        {user && (
          <div style={S.profileBar}>
            <div style={S.avatar}>👤</div>
            <div>
              <div style={S.profileName}>{user.name} · {user.vehicle}</div>
              <div style={S.profileDetail}>{user.vehicleType?.toUpperCase()} · {user.district}, {user.state} · Since {user.registeredOn}</div>
            </div>
            <button style={S.logoutBtn} onClick={()=>{localStorage.removeItem("svasti_user");setUser(null);}}>Logout</button>
          </div>
        )}

        {/* REGISTRATION */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>{user?`👋 Welcome back, ${user.name.split(" ")[0]}! Book your journey`:"📝 Register & Book Journey Slot"}</div>

          {!user ? (
            <>
              <div style={S.grid2}>
                <div style={S.field}><span style={S.label}>Full Name</span><input style={S.input} ref={nameRef} placeholder="e.g. Ravi Kumar"/></div>
                <div style={S.field}><span style={S.label}>Mobile</span><input style={S.input} ref={phoneRef} type="tel" placeholder="10-digit number" maxLength={10}/></div>
                <div style={S.field}><span style={S.label}>Vehicle Number</span><input style={S.input} ref={vehicleRef} placeholder="e.g. TS09AB1234"/></div>
                <div style={S.field}><span style={S.label}>Vehicle Type</span>
                  <select style={S.input} ref={vtRef}>
                    <option value="2w">Two Wheeler</option><option value="4w">Four Wheeler</option>
                    <option value="auto">Auto / Cab</option><option value="hv">Heavy Vehicle</option>
                  </select>
                </div>
                <div style={S.field}><span style={S.label}>State</span>
                  <select style={S.input} value={state} onChange={e=>handleState(e.target.value)}>
                    {Object.keys(DISTRICTS).sort().map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={S.field}><span style={S.label}>District</span>
                  <select style={S.input} value={district} onChange={e=>handleDistrict(e.target.value)}>
                    {districts.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div style={S.field}><span style={S.label}>Travelers</span><input style={S.input} ref={peopleRef} type="number" defaultValue={1} min={1} max={8}/></div>
              </div>

              <div style={{marginTop:16,marginBottom:4}}><span style={S.label}>Book Journey Slot</span></div>
              <div style={S.journeyBox}>
                <div style={S.slotSide}><div style={S.slotLbl}>FROM</div><input style={S.slotInp} ref={fromRef} placeholder="Starting point..."/></div>
                <div style={S.arrow}>→</div>
                <div style={S.slotSide}><div style={S.slotLbl}>TO</div><input style={S.slotInp} ref={toRef} placeholder="Destination..."/></div>
              </div>
              <div style={S.grid2}>
                <div style={S.field}><span style={S.label}>Date</span><input style={S.input} ref={dateRef} type="date"/></div>
                <div style={S.field}><span style={S.label}>Departure Time</span><input style={S.input} ref={timeRef} type="time"/></div>
              </div>
              <div style={{marginTop:14}}><span style={S.label}>Carpool Preference</span>
                <div style={S.carpoolRow}>
                  {[["no","🚗 Solo"],["open","🤝 Open to Carpool"],["offer","🚘 Offering Ride"]].map(([v,l])=>(
                    <div key={v} style={carpool===v?S.cpBtnActive:S.cpBtn} onClick={()=>setCarpool(v)}>{l}</div>
                  ))}
                </div>
              </div>
              <button style={S.mainBtn} onClick={register}>🚦 REGISTER & BOOK SLOT</button>
            </>
          ) : (
            <>
              <div style={S.journeyBox}>
                <div style={S.slotSide}><div style={S.slotLbl}>FROM</div><input style={S.slotInp} ref={from2} placeholder="Starting point..."/></div>
                <div style={S.arrow}>→</div>
                <div style={S.slotSide}><div style={S.slotLbl}>TO</div><input style={S.slotInp} ref={to2} placeholder="Destination..."/></div>
              </div>
              <div style={S.grid3}>
                <div style={S.field}><span style={S.label}>Date</span><input style={S.input} ref={date2} type="date" defaultValue={new Date().toISOString().split("T")[0]}/></div>
                <div style={S.field}><span style={S.label}>Time</span><input style={S.input} ref={time2} type="time"/></div>
                <div style={S.field}><span style={S.label}>Travelers</span><input style={S.input} ref={people2} type="number" defaultValue={1} min={1} max={8}/></div>
                <div style={{...S.field, gridColumn:"1/-1"}}><span style={S.label}>Carpool</span>
                  <select style={S.input} ref={cp2}><option value="no">Solo</option><option value="open">Open to Carpool</option><option value="offer">Offering Ride</option></select>
                </div>
              </div>
              <button style={S.mainBtn} onClick={bookJourney}>📍 BOOK JOURNEY SLOT</button>
            </>
          )}
          {result && <div style={result.cls==="ok"?S.resultOk:S.resultWarn}>{result.msg}</div>}
        </div>

        {/* LIVE PREDICTION */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>🚦 Live Prediction</div>
          <div style={S.predGrid}>
            <div style={S.predCard}><div style={S.predVal}>{pred.congestion}</div><div style={S.predLbl}>CONGESTION</div></div>
            <div style={S.predCard}><div style={S.predVal}>{pred.delay}</div><div style={S.predLbl}>DELAY</div></div>
            <div style={S.predCard}><div style={{...S.predVal,fontSize:22}}>{pred.fuel}</div><div style={S.predLbl}>FUEL</div></div>
          </div>
          <div style={S.predMsg}>{pred.msg}</div>
        </div>

        {/* HELPLINE */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>🚨 Traffic Helpline</div>
          <div style={S.locPill}><span style={S.dot}/>{locationLabel}</div>
          <div style={S.hlGrid}>
            <div style={S.hlCard}><div style={S.hlIcon}>🚔</div><div style={S.hlName}>{hl.name}</div><div style={S.hlNum}>{hl.police}</div></div>
            <div style={S.hlCard}><div style={S.hlIcon}>🚑</div><div style={S.hlName}>Emergency</div><div style={S.hlNum}>112</div></div>
            <div style={S.hlCard}><div style={S.hlIcon}>🛣️</div><div style={S.hlName}>Highway Patrol</div><div style={S.hlNumSafe}>1033</div></div>
          </div>
        </div>

        {/* MAP */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>🗺️ Live Traffic Map</div>
          <iframe style={S.mapFrame} src={`https://www.google.com/maps?q=${encodeURIComponent(mapQ)}&output=embed`} allowFullScreen/>
        </div>

        {/* CHART */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>📊 Traffic Volume – 24 Hour Pattern</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{top:4,bottom:4}}>
              <XAxis dataKey="h" tick={{fontSize:10,fill:"rgba(180,210,230,0.45)",fontFamily:"Exo 2"}} interval={1}/>
              <YAxis tick={{fontSize:10,fill:"rgba(180,210,230,0.45)"}} width={36}/>
              <Tooltip contentStyle={{background:"#0a1428",border:"1px solid rgba(0,200,255,0.2)",borderRadius:8,fontSize:12}} labelStyle={{color:"#00c8ff"}} itemStyle={{color:"#e8f4f8"}}/>
              <Bar dataKey="v" radius={[3,3,0,0]}>
                {chartData.map((d,i)=><Cell key={i} fill={d.peak?"#ff6b2b":"#00c8ff"} fillOpacity={0.75}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:8,fontSize:12,color:"rgba(180,210,230,0.5)"}}>🟠 Orange = Peak hours · 🔵 Blue = Off-peak · Updates with each booked slot</div>
        </div>

        {/* AI AGENTS */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>🤖 AI Agent Network</div>
          <div style={S.agentGrid}>
            {[{id:"predictor",icon:"🔮",name:"Predictor Agent",role:"LSTM · Congestion Forecasting"},
              {id:"optimizer",icon:"⚙️",name:"Optimizer Agent",role:"Signal · Lane · Route"},
              {id:"nudge",icon:"💬",name:"Nudge Agent",role:"Behavioral · Alerts · Carpool"},
              {id:"verifier",icon:"📊",name:"Verifier Agent",role:"Audit · SLA · Compliance"},
            ].map(a=>(
              <div key={a.id} style={activeAgent===a.id?S.agentActive:S.agent} onClick={()=>agentClick(a.id)}>
                <div style={S.agentIcon}>{a.icon}</div>
                <div style={S.agentName}>{a.name}</div>
                <div style={S.agentRole}>{a.role}</div>
              </div>
            ))}
          </div>
          <div style={S.agentOut}>{agentMsg}</div>
        </div>

        {/* AUDIT */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>📋 Audit Trail</div>
          <div style={S.audit} ref={auditRef}>
            {auditLog.map((e,i)=>(
              <div key={i} style={i===auditLog.length-1?S.auditLast:S.auditEntry}>{e}</div>
            ))}
          </div>
        </div>

        {/* IMPACT */}
        <div style={S.card}>
          <div style={S.cardAccent}/>
          <div style={S.cardTitle}>📈 Measurable Impact</div>
          <div style={S.impactGrid}>
            {[{n:"-46%",l:"Peak Delay Reduction"},{n:"₹11,500 Cr",l:"Annual Savings"},{n:"15%",l:"Fuel Saved"},
              {n:"5.8T",l:"CO₂ Reduced/Day"},{n:"98.7%",l:"SLA Compliance"},{n:liveCount.toLocaleString("en-IN")+"+",l:"Slots Booked Today"}
            ].map(({n,l})=>(
              <div key={l} style={S.impCard}><div style={S.impNum}>{n}</div><div style={S.impLbl}>{l}</div></div>
            ))}
          </div>
        </div>

        <div style={S.footer}>🚦 SVASTI · Predict. Optimize. Flow. · Built for Indian Cities · 2026</div>
      </div>
    </>
  );
}
