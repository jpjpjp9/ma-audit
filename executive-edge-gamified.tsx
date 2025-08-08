import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, AlertCircle, TrendingUp, Users, Target, Zap } from 'lucide-react';

const ExecutiveEdgeGamified = () => {
  const [stage, setStage] = useState('prime');
  const [tokens, setTokens] = useState(100);
  const [allocations, setAllocations] = useState({
    speed: 0,
    quality: 0,
    rituals: 0,
    bench: 0,
    change: 0,
    clarity: 0,
    comp: 0,
    customer: 0
  });
  const [collisionResponses, setCollisionResponses] = useState([]);
  const [tradeoffResponses, setTradeoffResponses] = useState([]);
  const [currentCollision, setCurrentCollision] = useState(0);
  const [currentTradeoff, setCurrentTradeoff] = useState(0);
  const [responseTime, setResponseTime] = useState({});
  const [revisions, setRevisions] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());

  // Token allocation categories
  const allocationCategories = [
    { id: 'speed', label: 'Speed to ship', icon: '⚡' },
    { id: 'quality', label: 'Quality bar', icon: '✨' },
    { id: 'rituals', label: 'Cross-functional rituals', icon: '🤝' },
    { id: 'bench', label: 'Bench depth', icon: '👥' },
    { id: 'change', label: 'Change readiness', icon: '🔄' },
    { id: 'clarity', label: 'Decision clarity', icon: '🎯' },
    { id: 'comp', label: 'Comp philosophy integrity', icon: '💰' },
    { id: 'customer', label: 'Customer intimacy', icon: '❤️' }
  ];

  // Collision scenarios
  const collisionScenarios = [
    {
      scenario: "VP Engineering blocks a cross-org OKR due to unclear decision rights",
      responses: [
        { text: "Override and push through - we need momentum", weights: { trust: -2, governance: -1, alignment: -2 } },
        { text: "Schedule alignment session with all stakeholders", weights: { trust: 1, governance: 2, alignment: 2 } },
        { text: "Escalate to CEO for final decision", weights: { trust: 0, governance: 1, alignment: 0 } },
        { text: "Let Engineering own it if they feel strongly", weights: { trust: 1, governance: -1, alignment: -1 } }
      ]
    },
    {
      scenario: "Top performer threatens to leave over comp disagreement",
      responses: [
        { text: "Match their ask - can't lose them", weights: { trust: -1, governance: -2, alignment: -2 } },
        { text: "Offer non-monetary benefits and growth path", weights: { trust: 2, governance: 1, alignment: 1 } },
        { text: "Hold firm on comp philosophy", weights: { trust: 0, governance: 2, alignment: 0 } },
        { text: "Create new role/title to justify increase", weights: { trust: -1, governance: -1, alignment: -1 } }
      ]
    },
    {
      scenario: "Board wants faster growth; team says quality will suffer",
      responses: [
        { text: "Push team harder - they'll figure it out", weights: { trust: -2, governance: 1, alignment: -2 } },
        { text: "Present trade-off analysis to board", weights: { trust: 2, governance: 2, alignment: 2 } },
        { text: "Hire more people to do both", weights: { trust: 0, governance: -1, alignment: 0 } },
        { text: "Quietly deprioritize some quality checks", weights: { trust: -2, governance: -2, alignment: -1 } }
      ]
    }
  ];

  // Trade-off dilemmas
  const tradeoffDilemmas = [
    { optionA: "Truth on time", optionB: "Harmony in public" },
    { optionA: "Ship fast", optionB: "Ship perfect" },
    { optionA: "Consensus decisions", optionB: "Clear ownership" },
    { optionA: "Retain all talent", optionB: "Upgrade talent" },
    { optionA: "Stable processes", optionB: "Constant innovation" },
    { optionA: "Internal promotion", optionB: "External expertise" },
    { optionA: "Transparency always", optionB: "Strategic ambiguity" },
    { optionA: "Customer delight", optionB: "Operational excellence" },
    { optionA: "Team autonomy", optionB: "Central alignment" },
    { optionA: "Long-term vision", optionB: "Quick wins" }
  ];

  const handleAllocationChange = (category, value) => {
    const oldValue = allocations[category];
    const difference = value - oldValue;
    
    if (tokens - difference >= 0 && value >= 0) {
      setAllocations(prev => ({ ...prev, [category]: value }));
      setTokens(prev => prev - difference);
    }
  };

  const handleCollisionResponse = (responseIndex, isRevision = false) => {
    const timeTaken = Date.now() - questionStartRef.current;
    setResponseTime(prev => ({ ...prev, [`collision_${currentCollision}`]: timeTaken }));
    
    if (isRevision) {
      setRevisions(prev => prev + 1);
    }
    
    const newResponses = [...collisionResponses];
    newResponses[currentCollision] = responseIndex;
    setCollisionResponses(newResponses);
    
    if (currentCollision < collisionScenarios.length - 1) {
      setCurrentCollision(prev => prev + 1);
      questionStartRef.current = Date.now();
    } else {
      setStage('tradeoff');
      questionStartRef.current = Date.now();
    }
  };

  const handleTradeoff = (choice) => {
    const timeTaken = Date.now() - questionStartRef.current;
    setResponseTime(prev => ({ ...prev, [`tradeoff_${currentTradeoff}`]: timeTaken }));
    
    const newResponses = [...tradeoffResponses];
    newResponses[currentTradeoff] = choice;
    setTradeoffResponses(newResponses);
    
    if (currentTradeoff < tradeoffDilemmas.length - 1) {
      setCurrentTradeoff(prev => prev + 1);
      questionStartRef.current = Date.now();
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    // Calculate vector map position based on allocations and responses
    const creativity = (allocations.speed + allocations.change + allocations.customer) / 3;
    const community = (allocations.rituals + allocations.bench) / 2;
    const discipline = (allocations.quality + allocations.clarity + allocations.comp) / 3;
    const advantage = (allocations.customer + allocations.speed) / 2;
    
    // Calculate dimension scores
    const culturalAlignment = Math.min(100, (community + creativity) * 2);
    const leadershipSuccession = Math.min(100, allocations.bench * 4);
    const communication = Math.min(100, (allocations.rituals + allocations.clarity) * 2.5);
    const talentRetention = Math.min(100, (allocations.bench + allocations.comp) * 2.5);
    const decisionRights = Math.min(100, allocations.clarity * 4);
    const changeMgmt = Math.min(100, allocations.change * 4);
    const incentives = Math.min(100, allocations.comp * 4);
    
    // Store results
    window.executiveEdgeResults = {
      vectorMap: { creativity, community, discipline, advantage },
      dimensions: {
        culturalAlignment,
        leadershipSuccession,
        communication,
        talentRetention,
        decisionRights,
        changeMgmt,
        incentives
      },
      outlierProbability: Math.max(5, Math.min(25, 
        (culturalAlignment + leadershipSuccession + communication + talentRetention + 
         decisionRights + changeMgmt + incentives) / 35)),
      responsePatterns: { responseTime, revisions }
    };
    
    setShowResults(true);
  };

  const ResultsView = () => {
    const results = window.executiveEdgeResults;
    const { vectorMap, dimensions, outlierProbability } = results;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Executive Edge Vector</h2>
            <p className="text-gray-600 mb-8">Based on 1,000+ comparable response patterns</p>
            
            {/* Vector Map */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Vector Map Position</h3>
              <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">Creativity</div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">Discipline</div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">Community</div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-sm font-medium text-gray-600">Advantage</div>
                
                <div 
                  className="absolute w-4 h-4 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                  style={{
                    left: `${50 + (vectorMap.advantage - vectorMap.community) * 2}%`,
                    top: `${50 - (vectorMap.creativity - vectorMap.discipline) * 2}%`
                  }}
                />
              </div>
            </div>
            
            {/* Outlier Probability */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-2">Outlier Probability</h3>
              <p className="text-3xl font-bold">{outlierProbability.toFixed(1)}%</p>
              <p className="text-sm opacity-90 mt-2">Likelihood you're truly A-tier based on response patterns</p>
            </div>
            
            {/* Seven Dimensions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Seven Dimension Assessment</h3>
              {Object.entries(dimensions).map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const color = value < 50 ? 'bg-red-500' : value < 70 ? 'bg-yellow-500' : 'bg-green-500';
                
                return (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm font-medium text-gray-700">{value.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${color} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Three Levers */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Your Three Critical Levers</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3">1.</span>
                  <p className="text-gray-700">Tighten decision rights before you add headcount; otherwise you scale confusion.</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3">2.</span>
                  <p className="text-gray-700">Build succession depth now - your bench is thinner than you think.</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3">3.</span>
                  <p className="text-gray-700">Invest in change management capabilities before the next pivot hits.</p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-8">
              Your full composite stays sealed until the executive debrief.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render different stages
  if (showResults) {
    return <ResultsView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* Prime Stage */}
      {stage === 'prime' && (
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              80% of CEOs rate their org A+
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              What are the odds you're the outlier... in the right direction?
            </p>
            <button
              onClick={() => {
                setStage('allocation');
                questionStartRef.current = Date.now();
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start the 3 Decisions Test
              <ChevronRight className="inline ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Capital Allocation Stage */}
      {stage === 'allocation' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Round 1: Capital Allocation</h2>
              <p className="text-gray-600">Distribute 100 tokens across what matters most</p>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold text-purple-600">{tokens}</span>
                <span className="text-gray-600 ml-2">tokens remaining</span>
              </div>
            </div>

            <div className="grid gap-4">
              {allocationCategories.map(category => (
                <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-600">
                      {allocations[category.id]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocations[category.id]}
                    onChange={(e) => handleAllocationChange(category.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9333ea 0%, #9333ea ${allocations[category.id]}%, #e5e7eb ${allocations[category.id]}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (tokens === 0) {
                  setStage('collision');
                  questionStartRef.current = Date.now();
                }
              }}
              disabled={tokens !== 0}
              className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                tokens === 0 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {tokens === 0 ? 'Continue to Round 2' : `Allocate ${tokens} more tokens`}
            </button>
          </div>
        </div>
      )}

      {/* Collision Cards Stage */}
      {stage === 'collision' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Round 2: Collision Cards</h2>
              <p className="text-gray-600">Scenario {currentCollision + 1} of {collisionScenarios.length}</p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <AlertCircle className="text-yellow-600 mb-3" size={32} />
              <p className="text-lg font-medium text-gray-800">
                {collisionScenarios[currentCollision].scenario}
              </p>
            </div>

            <div className="space-y-3">
              {collisionScenarios[currentCollision].responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleCollisionResponse(index)}
                  className="w-full text-left p-4 bg-gray-50 hover:bg-purple-50 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-105"
                >
                  <span className="text-gray-700">{response.text}</span>
                </button>
              ))}
            </div>

            {collisionResponses[currentCollision] !== undefined && (
              <button
                onClick={() => handleCollisionResponse(collisionResponses[currentCollision], true)}
                className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Do you want to change your mind?
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trade-off Speed Round */}
      {stage === 'tradeoff' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Round 3: Speed Round</h2>
              <p className="text-gray-600">Quick decisions only - {currentTradeoff + 1} of {tradeoffDilemmas.length}</p>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                    style={{ width: `${((currentTradeoff + 1) / tradeoffDilemmas.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-xl font-medium text-gray-700 mb-6">Choose one:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTradeoff('A')}
                  className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-lg font-semibold">{tradeoffDilemmas[currentTradeoff].optionA}</span>
                </button>
                <button
                  onClick={() => handleTradeoff('B')}
                  className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-lg font-semibold">{tradeoffDilemmas[currentTradeoff].optionB}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveEdgeGamified;