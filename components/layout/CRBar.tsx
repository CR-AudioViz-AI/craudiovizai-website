'use client';

import { useState, useEffect } from 'react';

// Extensive lists of C and R words
const C_WORDS = [
  'Creative', 'Confident', 'Cutting-edge', 'Collaborative', 'Connected', 'Convenient',
  'Compelling', 'Comprehensive', 'Consistent', 'Contemporary', 'Custom', 'Captivating',
  'Capable', 'Celebrated', 'Centered', 'Certified', 'Champion', 'Charitable', 'Cherished',
  'Clear', 'Clever', 'Cohesive', 'Colorful', 'Committed', 'Communicative', 'Community',
  'Compassionate', 'Competitive', 'Complete', 'Complex', 'Compliant', 'Concentrated',
  'Conceptual', 'Concise', 'Concrete', 'Configurable', 'Conscious', 'Consequential',
  'Considerate', 'Consolidated', 'Constant', 'Constructive', 'Consultative', 'Content',
  'Contextual', 'Continual', 'Continuous', 'Controllable', 'Conversational', 'Convertible',
  'Convincing', 'Cooperative', 'Coordinated', 'Core', 'Corporate', 'Correct', 'Cosmopolitan',
  'Cost-effective', 'Courageous', 'Courteous', 'Cozy', 'Crafted', 'Credible', 'Critical',
  'Cross-platform', 'Crowdsourced', 'Crucial', 'Crystal-clear', 'Curated', 'Curious',
  'Current', 'Customizable', 'Caring', 'Centralized', 'Certain', 'Charismatic', 'Charming',
  'Cheerful', 'Chic', 'Civil', 'Classy', 'Clean', 'Client-focused', 'Cloud-based',
  'Cognitive', 'Coherent', 'Collective', 'Comfortable', 'Commercial', 'Communal', 'Compact',
  'Compatible', 'Compensated', 'Competent', 'Complementary', 'Composed', 'Computed',
  'Concerned', 'Conclusive', 'Concurrent', 'Condensed', 'Conditional', 'Conducive',
  'Confidential', 'Confirmed', 'Conforming', 'Congenial', 'Conscientious', 'Consecutive',
  'Consensual', 'Conservative', 'Considerable', 'Consonant', 'Conspicuous', 'Constitutional',
  'Consummate', 'Contagious', 'Contented', 'Continental', 'Contingent', 'Contractual',
  'Contributing', 'Controlled', 'Conventional', 'Conversant', 'Cool', 'Copious', 'Cordial',
  'Correlative', 'Corresponding', 'Cosmic', 'Covert', 'Crafty', 'Creditable', 'Cross-functional',
  'Crowning', 'Crystalline', 'Cultivated', 'Cultural', 'Cumulative', 'Curative', 'Customary',
  'Customer-centric', 'Cybernetic', 'Candid', 'Canonical', 'Capacious', 'Capital', 'Carefree',
  'Careful', 'Casual', 'Categorical', 'Causal', 'Cautious', 'Celestial', 'Cellular', 'Central',
  'Ceremonial', 'Certified', 'Challenging', 'Changeable', 'Characteristic', 'Charged', 'Charismatic',
  'Charitable', 'Chatty', 'Checked', 'Chief', 'Childlike', 'Chivalrous', 'Choice', 'Chosen',
  'Chronic', 'Circular', 'Circumstantial', 'Civic', 'Civilized', 'Clandestine', 'Clarified',
  'Classic', 'Classical', 'Classified', 'Clause', 'Climactic', 'Clinical', 'Close', 'Closed',
  'Closest', 'Closing', 'Cloudless', 'Coated', 'Coded', 'Codified', 'Coexisting', 'Coined',
  'Cold', 'Collaborative', 'Collapsible', 'Collateral', 'Collected', 'Collegial', 'Colonial',
  'Colossal', 'Combination', 'Combined', 'Combustible', 'Comfortable', 'Comforting', 'Comic',
  'Commanding', 'Commemorative', 'Commendable', 'Commentated', 'Commissioned', 'Common',
  'Commonplace', 'Communicable', 'Compact', 'Comparable', 'Comparative', 'Compartmentalized',
  'Compassionate', 'Compelling', 'Compensatory', 'Competing', 'Compilation', 'Compiled',
  'Complacent', 'Complaining', 'Complementing', 'Completed', 'Complexed', 'Complimentary',
  'Component', 'Composite', 'Compound', 'Comprehensible', 'Compressed', 'Compromising',
  'Compulsory', 'Computational', 'Computerized', 'Concealed', 'Conceivable', 'Concentrated',
  'Concentric', 'Concerned', 'Concerted', 'Concessional', 'Conciliatory', 'Concluding',
  'Concocted', 'Concomitant', 'Concordant', 'Condemned', 'Condescending', 'Conditioned',
  'Conductive', 'Confederated', 'Confessed', 'Confidant', 'Configured', 'Confined', 'Conflicting',
  'Confluent', 'Conformal', 'Conformed', 'Confrontational', 'Confused', 'Congenital', 'Congested',
  'Congratulatory', 'Congressional', 'Congruent', 'Conical', 'Conjoined', 'Conjugal', 'Conjugated',
  'Conjunctive', 'Conjured', 'Connecting', 'Connective', 'Conquered', 'Consanguine', 'Conscience',
  'Conscientious', 'Conscripted', 'Consecrated', 'Consensual', 'Consequent', 'Conservational',
  'Conserved', 'Considerable', 'Considerate', 'Consigned', 'Consisting', 'Consoling', 'Consolidated',
  'Consonant', 'Conspicuous', 'Conspiratorial', 'Constrained', 'Constricted', 'Constructed'
];

const R_WORDS = [
  'Results', 'Revolutionary', 'Reliable', 'Responsive', 'Resourceful', 'Remarkable',
  'Robust', 'Rewarding', 'Resilient', 'Refined', 'Ready', 'Real-time', 'Realistic',
  'Reasonable', 'Reassuring', 'Receptive', 'Recognized', 'Recommended', 'Recoverable',
  'Recreational', 'Recursive', 'Recyclable', 'Redefined', 'Redesigned', 'Reduced',
  'Redundant', 'Referenced', 'Reflective', 'Reformed', 'Refreshing', 'Refundable',
  'Regal', 'Regional', 'Registered', 'Regular', 'Regulated', 'Reinforced', 'Rejuvenated',
  'Related', 'Relational', 'Relative', 'Relaxed', 'Relevant', 'Relieved', 'Remedial',
  'Renewable', 'Renowned', 'Rentable', 'Reorganized', 'Repairable', 'Repeatable',
  'Replenished', 'Replicated', 'Reportable', 'Representative', 'Reproducible', 'Reputable',
  'Requested', 'Required', 'Researched', 'Reserved', 'Residential', 'Resistant', 'Resolute',
  'Resolved', 'Resonant', 'Respected', 'Respectful', 'Respectable', 'Responsible', 'Restful',
  'Restorative', 'Restored', 'Restrained', 'Restricted', 'Restructured', 'Resultant', 'Retail',
  'Retained', 'Retentive', 'Rethought', 'Retired', 'Retooled', 'Retrievable', 'Retroactive',
  'Returnable', 'Reunited', 'Reusable', 'Revealed', 'Revealing', 'Revenue-generating',
  'Reverent', 'Reversible', 'Reviewed', 'Revised', 'Revitalized', 'Revolving', 'Rich',
  'Right', 'Righteous', 'Rightful', 'Rigid', 'Rigorous', 'Ripe', 'Rising', 'Riveting',
  'Roadworthy', 'Roaring', 'Rocketing', 'Rock-solid', 'Rolling', 'Romantic', 'Rooted',
  'Rotating', 'Round-the-clock', 'Rousing', 'Routine', 'Royal', 'Ruling', 'Running',
  'Rural', 'Radical', 'Radiant', 'Radiating', 'Rapid', 'Rare', 'Rated', 'Rational',
  'Ravishing', 'Razor-sharp', 'Reachable', 'Reactive', 'Readable', 'Ready-made', 'Real',
  'Realizable', 'Rear', 'Reasoned', 'Rebuildable', 'Rechargeable', 'Reciprocal', 'Reclaimable',
  'Recognizable', 'Reconciled', 'Reconstructed', 'Recorded', 'Recreated', 'Rectified',
  'Recurrent', 'Red-hot', 'Redeemable', 'Redeployed', 'Redirected', 'Reenergized',
  'Reengineered', 'Reestablished', 'Reexamined', 'Referable', 'Refillable', 'Reformulated',
  'Refracted', 'Refreshed', 'Refrigerated', 'Refurbished', 'Regained', 'Regarded',
  'Regenerated', 'Regimented', 'Regrouped', 'Rehabilitated', 'Reimagined', 'Reimbursed',
  'Reinstated', 'Reiterated', 'Rejuvenating', 'Rekindled', 'Relaunched', 'Released',
  'Relegated', 'Relentless', 'Relieving', 'Reloaded', 'Reluctant', 'Remaining', 'Remastered',
  'Remedied', 'Remembered', 'Reminded', 'Remodeled', 'Remote', 'Removable', 'Remunerated',
  'Renaissance', 'Rendered', 'Renegotiated', 'Renovated', 'Rented', 'Reordered', 'Reoriented',
  'Repacked', 'Repaid', 'Reparable', 'Radial', 'Radioactive', 'Ragged', 'Raging', 'Railing',
  'Rainbow', 'Rainy', 'Raised', 'Rallying', 'Rambling', 'Rampant', 'Random', 'Ranged',
  'Ranking', 'Rapid-fire', 'Rapturous', 'Rash', 'Ratified', 'Rationalized', 'Rattling',
  'Raucous', 'Raw', 'Razor-edged', 'Reacting', 'Readied', 'Ready-to-use', 'Reaffirmed',
  'Reagent', 'Realized', 'Reanimated', 'Reaped', 'Rearranged', 'Rearward', 'Reasoning',
  'Reassembled', 'Reassessed', 'Reassigned', 'Reattached', 'Reauthorized', 'Reawakened',
  'Rebel', 'Rebellious', 'Reborn', 'Rebounding', 'Rebranded', 'Rebuilt', 'Rebutted',
  'Recalculated', 'Recalibrated', 'Recalled', 'Recanted', 'Recapped', 'Recaptured',
  'Receding', 'Receivable', 'Received', 'Recent', 'Recentered', 'Reception', 'Recessed',
  'Recharged', 'Recherche', 'Recipient', 'Reciprocated', 'Recited', 'Reckless', 'Reckoned',
  'Reclaimed', 'Reclassified', 'Reclined', 'Reclusive', 'Recoated', 'Recognized', 'Recoiled',
  'Recollected', 'Recolonized', 'Recombinant', 'Recombined', 'Recommenced', 'Recompensed',
  'Recompiled', 'Recomposed', 'Recomputed', 'Reconceived', 'Reconcilable', 'Reconditioned',
  'Reconfigured', 'Reconfirmed', 'Reconnected', 'Reconquered', 'Reconsidered', 'Reconstituted',
  'Reconstructive', 'Reconvened', 'Reconverted', 'Recooked', 'Recounted', 'Recouped',
  'Recovered', 'Recreative', 'Recriminating', 'Recrossed', 'Recruited', 'Rectangular',
  'Rectifiable', 'Recto', 'Recumbent', 'Recuperated', 'Recuperative', 'Recurring', 'Recycled',
  'Red', 'Reddened', 'Reddish', 'Redecorated', 'Rededicated', 'Redeemed', 'Redeeming'
];

export default function CRBar() {
  const [currentPhrase, setCurrentPhrase] = useState('CR = Creative Results');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        
        // Every 25th rotation, show "Cindy & Roy"
        if (newCount % 25 === 0) {
          setCurrentPhrase('CR = Cindy & Roy');
        } else {
          // Generate random C and R word combination
          const randomC = C_WORDS[Math.floor(Math.random() * C_WORDS.length)];
          const randomR = R_WORDS[Math.floor(Math.random() * R_WORDS.length)];
          setCurrentPhrase(`CR = ${randomC} ${randomR}`);
        }
        
        return newCount;
      });
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 text-center">
      <p className="text-sm font-semibold tracking-wide transition-opacity duration-500">
        {currentPhrase}
      </p>
    </div>
  );
}
