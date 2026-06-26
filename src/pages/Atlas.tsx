import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Search, MapPin, Users, Activity, Target, ArrowRight, HeartPulse, Globe2, ZoomIn, ZoomOut } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY || import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Mock data based on Joshua Project API concept
const unreachedGroups = [
  // América do Sul & Brasil
  { id: 8, name: "Povos Indígenas Yanomami", country: "Brasil", coordinates: [-62.0, 1.0], population: "35.000", religion: "Animismo", status: "Não Alcançado", urgent: true, ethnicities: "Yanomami", needs: "Saúde, traduções bíblicas, missões transculturais" },
  { id: 10, name: "Comunidades Ribeirinhas", country: "Brasil", coordinates: [-60.0, -3.0], population: "1.5M", religion: "Catolicismo / Sincretismo", status: "Pouco Alcançado", urgent: true, ethnicities: "Ribeirinhos Amazônicos", needs: "Embarcações missionárias, ensino bíblico, saúde" },
  { id: 11, name: "Sertanejos do Semiárido", country: "Brasil", coordinates: [-39.0, -8.0], population: "27M", religion: "Catolicismo", status: "Pouco Alcançado", urgent: false, ethnicities: "Nordestinos", needs: "Acesso à água, projetos sociais" },
  { id: 13, name: "Povos Andinos", country: "Peru", coordinates: [-75.0, -9.0], population: "2.1M", religion: "Animismo", status: "Pouco Alcançado", urgent: true, ethnicities: "Quechua, Aymara", needs: "Liderança nativa, material teológico" },
  { id: 14, name: "Indígenas Wayuu", country: "Colômbia/Venezuela", coordinates: [-72.0, 11.0], population: "400.000", religion: "Animismo", status: "Pouco Alcançado", urgent: true, ethnicities: "Wayuu", needs: "Água potável, tradução, igrejas rurais" },
  { id: 27, name: "Povo Ayoreo", country: "Bolívia", coordinates: [-62.0, -19.0], population: "3.100", religion: "Animismo", status: "Não Alcançado", urgent: true, ethnicities: "Ayoreo", needs: "Assistência médica básica, demarcação de terras" },
  { id: 28, name: "Povos Mapuche", country: "Chile/Argentina", coordinates: [-71.0, -38.0], population: "1.7M", religion: "Catolicismo / Animismo", status: "Pouco Alcançado", urgent: false, ethnicities: "Mapuche", needs: "Reconciliação e Bíblias em Mapudungun" },
  { id: 29, name: "Wichi/Toba", country: "Argentina", coordinates: [-61.0, -24.0], population: "80.000", religion: "Animismo", status: "Pouco Alcançado", urgent: true, ethnicities: "Wichi", needs: "Água, saúde, direitos territoriais" },
  // América Central e do Norte
  { id: 15, name: "Povo Garífuna", country: "Honduras", coordinates: [-86.0, 15.0], population: "300.000", religion: "Catolicismo / Culto aos Ancestrais", status: "Pouco Alcançado", urgent: false, ethnicities: "Garífuna", needs: "Discipulado, libertação espiritual" },
  { id: 16, name: "Nação Navajo", country: "EUA", coordinates: [-109.0, 36.0], population: "390.000", religion: "Religião Tradicional / Cristianismo Misto", status: "Pouco Alcançado", urgent: false, ethnicities: "Navajo (Diné)", needs: "Tratamento de traumas, líderes nativos" },
  { id: 17, name: "Povo Inuit", country: "Canadá", coordinates: [-80.0, 68.0], population: "65.000", religion: "Animismo / Cristianismo", status: "Alcançado Parcialmente", urgent: false, ethnicities: "Inuit", needs: "Esperança contra altos índices de suicídio, integração" },
  // Ásia
  { id: 1, name: "Povo Baloch", country: "Paquistão", coordinates: [65.0, 28.0], population: "8.5M", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Baloch, Brahui", needs: "Bíblias traduzidas, plantadores de igrejas" },
  { id: 2, name: "Povo Shaikh", country: "Bangladesh", coordinates: [90.0, 24.0], population: "133M", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Shaikh", needs: "Evangelismo, liderança" },
  { id: 4, name: "Povo Brahmin", country: "Índia", coordinates: [78.0, 21.0], population: "60M", religion: "Hinduísmo", status: "Não Alcançado", urgent: true, ethnicities: "Brahmin, Rajput", needs: "Materiais apologéticos, discipulado" },
  { id: 7, name: "Povo Uiugur", country: "China", coordinates: [85.0, 41.0], population: "12M", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Uyghur", needs: "Intercessão, liberdade religiosa, apoio a refugiados" },
  { id: 5, name: "Povo Sundanês", country: "Indonésia", coordinates: [107.0, -7.0], population: "38M", religion: "Islamismo", status: "Pouco Alcançado", urgent: false, ethnicities: "Sundanês", needs: "Treinamento pastoral, orfanatos" },
  // Europa
  { id: 18, name: "Romani (Ciganos)", country: "Romênia / França", coordinates: [25.0, 45.0], population: "10M+", religion: "Catolicismo / Ortodoxismo", status: "Pouco Alcançado", urgent: true, ethnicities: "Vlax, Sintos", needs: "Inclusão, educação, igrejas locais fortes" },
  { id: 19, name: "Tártaros do Volga", country: "Rússia", coordinates: [49.0, 55.0], population: "5.3M", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Tártaros", needs: "Traduções modernas, rádio cristã" },
  // Oceania
  { id: 20, name: "Aborígenes Australianos", country: "Austrália", coordinates: [133.0, -23.0], population: "798.000", religion: "Espiritualidade Tradicional", status: "Pouco Alcançado", urgent: false, ethnicities: "Vários grupos", needs: "Reconciliação, discipulado contextualizado" },
  { id: 21, name: "Tribos do Rio Sepik", country: "Papua Nova Guiné", coordinates: [143.0, -4.0], population: "400.000", religion: "Animismo", status: "Não Alcançado", urgent: true, ethnicities: "Iatmul, etc.", needs: "Aviação missionária, tradução oral" },
  // África
  { id: 3, name: "Povo Hausa", country: "Nigéria", coordinates: [8.0, 11.0], population: "35M", religion: "Islamismo", status: "Não Alcançado", urgent: false, ethnicities: "Hausa", needs: "Educação, saúde, missionários" },
  { id: 6, name: "Povo Berbere", country: "Marrocos", coordinates: [-5.0, 31.0], population: "14M", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Amazigh, Riffian", needs: "Mídia cristã, rádios" },
  { id: 22, name: "Povo Fulani", country: "Níger / Mali", coordinates: [8.0, 14.0], population: "30M+", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Fula, Peul", needs: "Veterinários, escolas móveis, evangelistas rurais" },
  { id: 23, name: "Povo Somáli", country: "Somália", coordinates: [46.0, 5.0], population: "16M", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Somáli", needs: "Ajuda humanitária, obreiros anônimos" },
  // Oriente Médio
  { id: 24, name: "Curdos Suranis", country: "Iraque / Síria", coordinates: [44.0, 36.0], population: "8M", religion: "Islamismo Sunni", status: "Não Alcançado", urgent: true, ethnicities: "Curdos", needs: "Refcomunicação, mídia satélite, Bíblias" },
  { id: 25, name: "Persas", country: "Irã", coordinates: [53.0, 32.0], population: "40M+", religion: "Islamismo Xiita", status: "Despertamento", urgent: true, ethnicities: "Persas", needs: "Discipulado digital, redes secretas de igrejas domésticas" },
  { id: 26, name: "Beduínos Árabes", country: "Arábia Saudita", coordinates: [45.0, 23.0], population: "Vários Milhões", religion: "Islamismo", status: "Não Alcançado", urgent: true, ethnicities: "Beduínos Nômades", needs: "Acesso, ministério entre as tendas, oração" }
];

export function Atlas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroup, setActiveGroup] = useState<typeof unreachedGroups[0] | null>(null);
  const [groups, setGroups] = useState(unreachedGroups);
  const [isSearching, setIsSearching] = useState(false);
  const [position, setPosition] = useState({ coordinates: [0, 10] as [number, number], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleMoveEnd(newPosition: { coordinates: [number, number]; zoom: number }) {
    setPosition(newPosition);
  }

  const fetchDynamicGroups = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setGroups(unreachedGroups);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/atlas/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm })
      });
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setGroups(data.results);
      } else {
        // Fallback local local
        setGroups(unreachedGroups.filter(g => 
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.country.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      }
    } catch (e) {
      console.error(e);
      setGroups(unreachedGroups.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.country.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center space-x-2 text-mission-orange font-medium mb-3">
                <GlobeIcon className="h-5 w-5" />
                <span>Atlas Interativo</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Povos Não Alcançados
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg">
                Mapeamento em tempo real de etnias e grupos minoritários ao redor do mundo. 
                Use estes dados para direcionar suas orações, apoiar missões ou planejar o seu envio.
              </p>
            </div>
            
            <div className="flex bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 gap-8">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Mapeado</p>
                <p className="text-2xl font-bold text-slate-900">7.420+</p>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Status Global</p>
                <div className="flex items-center space-x-2 text-rose-500">
                  <Activity className="h-5 w-5" />
                  <span className="font-bold">Urgente</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative"
            style={{ height: '600px' }}
          >
            {!hasValidKey ? (
              <div className="relative w-full h-full bg-slate-950 overflow-hidden">
                <ComposableMap
                  projectionConfig={{ rotate: [-10, 0, 0], scale: 140 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#1e293b"
                              stroke="#334155"
                              strokeWidth={0.5}
                              style={{
                                default: { fill: "#0f172a", outline: "none" },
                                hover: { fill: "#1e293b", outline: "none" },
                                pressed: { fill: "#020617", outline: "none" },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {groups.map((group, index) => {
                      const isActive = activeGroup?.id === group.id;
                      const pinColor = isActive ? "#ea580c" : (group.urgent ? "#ef4444" : "#f97316");
                      return (
                        <Marker
                          key={group.id || index}
                          coordinates={group.coordinates as [number, number]}
                          onClick={() => setActiveGroup(group as any)}
                        >
                          <circle
                            r={isActive ? 7 : 4}
                            fill={pinColor}
                            stroke="#ffffff"
                            strokeWidth={1.5}
                            className="cursor-pointer transition-all duration-300 hover:scale-125"
                          />
                          {isActive && (
                            <circle
                              r={12}
                              fill="none"
                              stroke={pinColor}
                              strokeWidth={1.5}
                              className="animate-ping"
                              style={{ pointerEvents: 'none' }}
                            />
                          )}
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
                
                {/* Custom Map Zoom Controls */}
                <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-10">
                  <button 
                    onClick={handleZoomIn}
                    className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 shadow transition-colors cursor-pointer"
                    title="Aumentar Zoom"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleZoomOut}
                    className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 shadow transition-colors cursor-pointer"
                    title="Diminuir Zoom"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Floating Note */}
                <div className="absolute top-20 right-6 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 text-xs shadow-md">
                  <span>Modo Vetorial (Sem Chave do Google Maps)</span>
                </div>
              </div>
            ) : (
              <APIProvider apiKey={API_KEY} version="weekly">
                <GoogleMap
                  defaultCenter={{lat: 10, lng: 10}}
                  defaultZoom={2}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{width: '100%', height: '100%'}}
                  disableDefaultUI={true}
                >
                  {groups.map((group, index) => {
                    const lat = group.coordinates[1];
                    const lng = group.coordinates[0];
                    const isActive = activeGroup?.id === group.id;
                    const pinBg = isActive ? "#ea580c" : (group.urgent ? "#ef4444" : "#f97316");

                    return (
                      <AdvancedMarker
                        key={group.id || index}
                        position={{lat, lng}}
                        title={group.name}
                        onClick={() => setActiveGroup(group as any)}
                        clickable={true}
                      >
                        <Pin background={pinBg} borderColor={isActive ? "#fff" : pinBg} glyphColor="#fff" />
                      </AdvancedMarker>
                    );
                  })}
                </GoogleMap>
              </APIProvider>
            )}
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm border border-slate-100 text-sm">
              <div className="font-semibold text-slate-800 mb-3">Legenda</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-slate-600">Prioridade Máxima</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-mission-orange"></div>
                  <span className="text-slate-600">Atenção Necessária</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-6 left-6 right-6">
              <form onSubmit={fetchDynamicGroups} className="flex items-center bg-white rounded-full shadow-md px-4 py-3 border border-slate-100 max-w-sm mx-auto w-full">
                {isSearching ? (
                  <Activity className="h-5 w-5 text-mission-orange mr-3 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-slate-400 mr-3" />
                )}
                <input 
                  type="text" 
                  placeholder="Pesquisar (Aperte Enter)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-700 w-full placeholder-slate-400"
                />
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Active Group Details */}
            {activeGroup ? (
              <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wide mb-4 text-orange-200">
                  {activeGroup.status}
                </div>
                <h2 className="text-2xl font-bold mb-2">{activeGroup.name}</h2>
                <div className="flex items-center text-slate-300 mb-6 space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{activeGroup.country}</span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">População Estimada</div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-mission-orange" />
                      <span className="font-semibold text-lg">{activeGroup.population}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Religião Majoritária</div>
                    <div className="font-semibold text-lg">{activeGroup.religion}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Principais Etnias</div>
                    <div className="flex items-center space-x-2">
                      <Globe2 className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-sm">{activeGroup.ethnicities}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Maior Necessidade</div>
                    <div className="flex items-center space-x-2">
                      <HeartPulse className="h-5 w-5 text-rose-400" />
                      <span className="font-semibold text-sm">{activeGroup.needs}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-mission-orange hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center group">
                  <span>Adotar em Oração</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-3xl p-8 text-center text-white shadow-xl flex flex-col items-center justify-center min-h-[400px]">
                <Target className="h-16 w-16 text-slate-700 mb-4" />
                <h3 className="text-xl font-bold mb-3">Selecione um Grupo</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Clique nos marcadores no mapa interativo ou use a busca para visualizar os desafios transculturais de cada etnia.
                </p>
              </div>
            )}
            
            {/* Context Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-grow">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <GlobeIcon className="mr-2 h-5 w-5 text-mission-orange" />
                A Janela 10/40
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                A "Janela 10/40" é a região retangular entre os paralelos 10 e 40 graus ao norte do Equador. Abrange partes da Europa, África e Ásia, incluindo as maiores populações não alcançadas pelo Evangelho no mundo hoje.
              </p>
              <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm font-medium border border-orange-100">
                Mais de 95% dos grupos não alcançados vivem nesta região geográfica isolada.
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
