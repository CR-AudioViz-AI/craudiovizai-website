'use client';

import { useState, useEffect } from 'react';

// Extensive lists of C and R words
const C_WORDS = [
  'Creative', 'Confident', 'Cutting-edge', 'Collaborative', 'Connected', 'Convenient',
  'Compelling', 'Comprehensive', 'Consistent', 'Contemporary', 'Custom', 'Captivating',
  'Capable', 'Celebrated', 'Centered', 'Certified', 'Champion', 'Charitable', 'Cherished',
  'Clear', 'Clever', 'Cohesive', 'Colorful', 'Committed', 'Communicative', 'Community',
  'Compassionate', 'Competitive', 'Complete', 'Complex', 'Compliant', 'Concentrated',
  'Conceptual', 'Concise', 'Concrete', 'Confident', 'Configurable', 'Conscious',
  'Consequential', 'Considerate', 'Consolidated', 'Constant', 'Constructive', 'Consultative',
  'Contemporary', 'Content', 'Contextual', 'Continual', 'Continuous', 'Controllable',
  'Convenient', 'Conversational', 'Convertible', 'Convincing', 'Cooperative', 'Coordinated',
  'Core', 'Corporate', 'Correct', 'Cosmopolitan', 'Cost-effective', 'Courageous',
  'Courteous', 'Cozy', 'Crafted', 'Credible', 'Critical', 'Cross-platform', 'Crowdsourced',
  'Crucial', 'Crystal-clear', 'Curated', 'Curious', 'Current', 'Customizable', 'Cutting-edge',
  'Caring', 'Celebrated', 'Centralized', 'Certain', 'Charismatic', 'Charming', 'Cheerful',
  'Chic', 'Civil', 'Classy', 'Clean', 'Client-focused', 'Cloud-based', 'Cognitive',
  'Coherent', 'Collective', 'Comfortable', 'Commercial', 'Communal', 'Compact', 'Compatible',
  'Compensated', 'Competent', 'Complementary', 'Composed', 'Comprehensive', 'Computed',
  'Concentrated', 'Concerned', 'Conclusive', 'Concurrent', 'Condensed', 'Conditional',
  'Conducive', 'Confident', 'Confidential', 'Confirmed', 'Conforming', 'Congenial',
  'Connected', 'Conscientious', 'Conscious', 'Consecutive', 'Consensual', 'Conservative',
  'Considerable', 'Considerate', 'Consistent', 'Consonant', 'Conspicuous', 'Constant',
  'Constitutional', 'Constructive', 'Consummate', 'Contagious', 'Contemporary', 'Contented',
  'Contextual', 'Continental', 'Contingent', 'Continual', 'Continuous', 'Contractual',
  'Contributing', 'Controlled', 'Convenient', 'Conventional', 'Conversant', 'Convertible',
  'Convincing', 'Cool', 'Cooperative', 'Coordinated', 'Copious', 'Cordial', 'Core',
  'Corporate', 'Correct', 'Correlative', 'Corresponding', 'Cosmic', 'Cosmopolitan',
  'Cost-effective', 'Courageous', 'Courteous', 'Covert', 'Cozy', 'Crafted', 'Crafty',
  'Creative', 'Credible', 'Creditable', 'Critical', 'Cross-functional', 'Crowning',
  'Crucial', 'Crystalline', 'Cultivated', 'Cultural', 'Cumulative', 'Curative', 'Curated',
  'Curious', 'Current', 'Customary', 'Customer-centric', 'Customizable', 'Cybernetic'
];

const R_WORDS = [
  'Results', 'Revolutionary', 'Reliable', 'Responsive', 'Resourceful', 'Remarkable',
  'Robust', 'Rewarding', 'Resilient', 'Refined', 'Ready', 'Real-time', 'Realistic',
  'Reasonable', 'Reassuring', 'Receptive', 'Recognized', 'Recommended', 'Recoverable',
  'Recreational', 'Recursive', 'Recyclable', 'Redefined', 'Redesigned', 'Reduced',
  'Redundant', 'Referenced', 'Refined', 'Reflective', 'Reformed', 'Refreshing',
  'Refundable', 'Regal', 'Regional', 'Registered', 'Regular', 'Regulated', 'Reinforced',
  'Rejuvenated', 'Related', 'Relational', 'Relative', 'Relaxed', 'Relevant', 'Reliable',
  'Relieved', 'Remarkable', 'Remedial', 'Memorable', 'Renewable', 'Renowned', 'Rentable',
  'Reorganized', 'Repairable', 'Repeatable', 'Replenished', 'Replicated', 'Reportable',
  'Representative', 'Reproducible', 'Reputable', 'Requested', 'Required', 'Researched',
  'Reserved', 'Residential', 'Resilient', 'Resistant', 'Resolute', 'Resolved', 'Resonant',
  'Resourceful', 'Respected', 'Respectful', 'Respectable', 'Responsive', 'Responsible',
  'Restful', 'Restorative', 'Restored', 'Restrained', 'Restricted', 'Restructured',
  'Resultant', 'Retail', 'Retained', 'Retentive', 'Rethought', 'Retired', 'Retooled',
  'Retrievable', 'Retroactive', 'Returnable', 'Reunited', 'Reusable', 'Revealed',
  'Revealing', 'Revenue-generating', 'Reverent', 'Reversible', 'Reviewed', 'Revised',
  'Revitalized', 'Revolutionary', 'Revolving', 'Rewarding', 'Rich', 'Right', 'Righteous',
  'Rightful', 'Rigid', 'Rigorous', 'Ripe', 'Rising', 'Riveting', 'Roadworthy', 'Roaring',
  'Robust', 'Rocketing', 'Rock-solid', 'Rolling', 'Romantic', 'Rooted', 'Rotating',
  'Round-the-clock', 'Rousing', 'Routine', 'Royal', 'Ruling', 'Running', 'Rural',
  'Radical', 'Radiant', 'Radiating', 'Rapid', 'Rare', 'Rated', 'Rational', 'Ravishing',
  'Razor-sharp', 'Reachable', 'Reactive', 'Readable', 'Ready-made', 'Real', 'Realizable',
  'Rear', 'Reasoned', 'Rebuildable', 'Receptive', 'Rechargeable', 'Reciprocal', 'Reclaimable',
  'Recognizable', 'Reconciled', 'Reconstructed', 'Recorded', 'Recreated', 'Rectified',
  'Recurrent', 'Red-hot', 'Redeemable', 'Redeployed', 'Redirected', 'Reenergized',
  'Reengineered', 'Reestablished', 'Reexamined', 'Referable', 'Refillable', 'Reformulated',
  'Refracted', 'Refreshed', 'Refrigerated', 'Refurbished', 'Regained', 'Regarded',
  'Regenerated', 'Regimented', 'Registered', 'Regrouped', 'Rehabilitated', 'Reimagined',
  'Reimbursed', 'Reinforced', 'Reinstated', 'Reiterated', 'Rejuvenating', 'Rekindled',
  'Relaunched', 'Released', 'Relegated', 'Relentless', 'Relieving', 'Reloaded', 'Reluctant',
  'Remaining', 'Remastered', 'Remedied', 'Remembered', 'Reminded', 'Remodeled', 'Remote',
  'Removable', 'Remunerated', 'Renaissance', 'Rendered', 'Renegotiated', 'Renewed',
  'Renovated', 'Rented', 'Reordered', 'Reoriented', 'Repacked', 'Repaid', 'Reparable'
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
      <p className="text-sm font-semibold tracking-wide animate-fade-in">
        {currentPhrase}
      </p>
    </div>
  );
}
