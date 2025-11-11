// ============================================================================
// JAVARI AI - AUTONOMOUS SECURITY THREAT HANDLER
// ============================================================================
// Created: Tuesday, November 4, 2025 - 10:12 PM EST
// Purpose: Javari autonomously detects, analyzes, and responds to security threats
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ============================================================================
// THREAT SEVERITY SCORING
// ============================================================================

function calculateThreatSeverity(threat: any): 'low' | 'medium' | 'high' | 'critical' {
  const severityScores: Record<string, number> = {
    sql_injection: 90,
    xss_attack: 85,
    path_traversal: 80,
    credential_stuffing: 95,
    ddos_attempt: 95,
    api_abuse: 70,
    rate_limit_exceeded: 50,
    bot_detected: 40,
    suspicious_pattern: 60,
  };

  const baseScore = severityScores[threat.threat_type] || 50;
  
  // Adjust for repeat offender
  let score = baseScore;
  if (threat.repeat_offender) score += 20;
  if (threat.authenticated_user) score += 15;
  
  if (score >= 90) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

// ============================================================================
// JAVARI THREAT ANALYSIS
// ============================================================================

async function analyzeThreatWithAI(threat: any): Promise<{
  analysis: string;
  confidence_score: number;
  recommended_action: string;
  reasoning: string;
}> {
  const prompt = `You are Javari AI, a security analyst for CR AudioViz AI. Analyze this security threat:

**Threat Type:** ${threat.threat_type}
**IP Address:** ${threat.ip_address}
**Request URL:** ${threat.request_url}
**Method:** ${threat.request_method}
**User Agent:** ${threat.user_agent}
**Request Body:** ${JSON.stringify(threat.request_body, null, 2)}

**Instructions:**
1. Determine if this is a real threat or false positive
2. Assess the attacker's sophistication level
3. Recommend one of these actions: 'block_immediately', 'trap_in_honeypot', 'monitor_closely', 'ignore'
4. Provide confidence score (0-1)
5. Explain your reasoning

Respond ONLY with valid JSON:
{
  "is_real_threat": boolean,
  "sophistication_level": "low" | "medium" | "high",
  "attacker_intent": "reconnaissance" | "exploitation" | "data_theft" | "disruption",
  "recommended_action": "block_immediately" | "trap_in_honeypot" | "monitor_closely" | "ignore",
  "confidence_score": number,
  "reasoning": "string",
  "additional_indicators": ["string"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonText = content.text.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysis = JSON.parse(jsonText);

    return {
      analysis: JSON.stringify(analysis),
      confidence_score: analysis.confidence_score,
      recommended_action: analysis.recommended_action,
      reasoning: analysis.reasoning,
    };
  } catch (error: unknown) {
    logError('Error analyzing threat with AI:\', error);
    
    // Fallback to rule-based analysis
    return {
      analysis: 'AI analysis failed, using rule-based assessment',
      confidence_score: 0.5,
      recommended_action: threat.threat_type === 'sql_injection' ? 'block_immediately' : 'monitor_closely',
      reasoning: 'Automatic fallback due to AI analysis error',
    };
  }
}

// ============================================================================
// CREATE JAVARI SECURITY TICKET
// ============================================================================

async function createSecurityTicket(
  threatId: string,
  analysis: any
): Promise<string> {
  const priority = analysis.confidence_score > 0.8 ? 'critical' :
                   analysis.confidence_score > 0.6 ? 'high' :
                   analysis.confidence_score > 0.4 ? 'medium' : 'low';

  const { data: ticket, error } = await supabase
    .rpc('create_javari_security_ticket', {
      p_threat_id: threatId,
      p_priority: priority,
      p_threat_summary: analysis.reasoning,
      p_analysis: analysis,
    });

  if (error) {
    logError('Error creating security ticket:\', error);
    throw error;
  }

  // Log event
  await supabase.from('security_events').insert({
    event_type: 'javari_ticket_created',
    event_category: 'javari_action',
    severity: priority === 'critical' ? 'critical' : 'warning',
    description: `Javari created security ticket for threat: ${threatId}`,
    metadata: { threat_id: threatId, ticket_id: ticket },
  });

  return ticket;
}

// ============================================================================
// EXECUTE JAVARI ACTION
// ============================================================================

async function executeSecurityAction(
  ticketId: string,
  action: string,
  threat: any
): Promise<{ success: boolean; message: string }> {
  const actionStart = Date.now();
  
  try {
    switch (action) {
      case 'block_immediately':
        await blockIP(threat.ip_address, threat.threat_type, ticketId);
        break;
        
      case 'trap_in_honeypot':
        await activateHoneypot(threat.ip_address, threat.id, ticketId);
        break;
        
      case 'monitor_closely':
        await addToWatchlist(threat.ip_address, threat.threat_type, ticketId);
        break;
        
      case 'ignore':
        // Do nothing, but log it
        break;
        
      default:
        console.warn(`Unknown action: ${action}`);
    }

    const executionTime = Date.now() - actionStart;

    // Log action
    await supabase.from('javari_security_actions').insert({
      ticket_id: ticketId,
      action_type: action === 'block_immediately' ? 'ip_blocked' :
                   action === 'trap_in_honeypot' ? 'honeypot_activated' :
                   action === 'monitor_closely' ? 'threat_analyzed' : 'ignored',
      action_details: {
        action,
        threat_id: threat.id,
        ip_address: threat.ip_address,
        timestamp: new Date().toISOString(),
      },
      success: true,
      execution_time: `${executionTime} ms`,
    });

    return {
      success: true,
      message: `Action '${action}' executed successfully in ${executionTime}ms`,
    };
  } catch (error: any) {
    const executionTime = Date.now() - actionStart;
    
    // Log failed action
    await supabase.from('javari_security_actions').insert({
      ticket_id: ticketId,
      action_type: 'error',
      action_details: { action, error: error.message },
      success: false,
      error_message: error.message,
      execution_time: `${executionTime} ms`,
    });

    return {
      success: false,
      message: `Action failed: ${error.message}`,
    };
  }
}

// ============================================================================
// SPECIFIC ACTION IMPLEMENTATIONS
// ============================================================================

async function blockIP(
  ipAddress: string,
  reason: string,
  ticketId: string
): Promise<void> {
  // Check if already blocked
  const { data: existing } = await supabase
    .from('security_ip_blocklist')
    .select('id')
    .eq('ip_address', ipAddress)
    .single();

  if (existing) {
    // Update existing block
    await supabase
      .from('security_ip_blocklist')
      .update({
        threat_count: supabase.from('security_ip_blocklist').select('threat_count').increment(),
        updated_at: new Date().toISOString(),
        notes: `Additional threat detected. Ticket: ${ticketId}`,
      })
      .eq('ip_address', ipAddress);
  } else {
    // Create new block
    await supabase.from('security_ip_blocklist').insert({
      ip_address: ipAddress,
      block_type: 'permanent',
      reason,
      blocked_by: 'javari',
      javari_decision: true,
      notes: `Blocked by Javari. Ticket: ${ticketId}`,
    });
  }

  // Log event
  await supabase.from('security_events').insert({
    event_type: 'ip_blocked',
    event_category: 'javari_action',
    severity: 'warning',
    description: `Javari blocked IP ${ipAddress} due to: ${reason}`,
    metadata: { ip_address: ipAddress, ticket_id: ticketId },
    actor: 'javari',
    ip_address: ipAddress,
  });
}

async function activateHoneypot(
  ipAddress: string,
  threatId: string,
  ticketId: string
): Promise<void> {
  await supabase.from('security_honeypot_catches').insert({
    threat_id: threatId,
    ip_address: ipAddress,
    entry_point: '/honeypot',
    still_active: true,
    data_collected: {
      trapped_by: 'javari',
      ticket_id: ticketId,
      timestamp: new Date().toISOString(),
    },
  });

  // Update threat record
  await supabase
    .from('security_threats')
    .update({ trapped_in_honeypot: true })
    .eq('id', threatId);

  // Log event
  await supabase.from('security_events').insert({
    event_type: 'honeypot_activated',
    event_category: 'javari_action',
    severity: 'info',
    description: `Javari trapped IP ${ipAddress} in honeypot`,
    metadata: { ip_address: ipAddress, ticket_id: ticketId },
    actor: 'javari',
    ip_address: ipAddress,
  });
}

async function addToWatchlist(
  ipAddress: string,
  threatType: string,
  ticketId: string
): Promise<void> {
  // Add as temporary block (expires in 24 hours)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabase.from('security_ip_blocklist').insert({
    ip_address: ipAddress,
    block_type: 'suspicious',
    reason: `Monitoring for ${threatType}`,
    expires_at: expiresAt.toISOString(),
    blocked_by: 'javari',
    javari_decision: true,
    notes: `Added to watchlist. Ticket: ${ticketId}`,
  });

  // Log event
  await supabase.from('security_events').insert({
    event_type: 'watchlist_added',
    event_category: 'javari_action',
    severity: 'info',
    description: `Javari added IP ${ipAddress} to watchlist`,
    metadata: { ip_address: ipAddress, ticket_id: ticketId },
    actor: 'javari',
    ip_address: ipAddress,
  });
}

// ============================================================================
// MAIN HANDLER: JAVARI PROCESSES SECURITY THREAT
// ============================================================================

export async function javariHandleThreat(threatId: string): Promise<{
  success: boolean;
  ticketId?: string;
  action?: string;
  message: string;
}> {
  console.log(`🔒 Javari processing security threat: ${threatId}`);

  try {
    // 1. Get threat details
    const { data: threat, error: fetchError } = await supabase
      .from('security_threats')
      .select('*')
      .eq('id', threatId)
      .single();

    if (fetchError || !threat) {
      throw new Error('Threat not found');
    }

    // 2. Check if IP is whitelisted
    const { data: whitelisted } = await supabase.rpc('is_ip_whitelisted', {
      check_ip: threat.ip_address,
    });

    if (whitelisted) {
      console.log(`✅ IP ${threat.ip_address} is whitelisted, ignoring threat`);
      return {
        success: true,
        message: 'IP is whitelisted, no action taken',
      };
    }

    // 3. Calculate severity
    const severity = calculateThreatSeverity(threat);

    // 4. Analyze with AI
    console.log('🧠 Analyzing threat with Javari AI...');
    const analysis = await analyzeThreatWithAI(threat);

    // 5. Create security ticket
    console.log('📋 Creating security ticket...');
    const ticketId = await createSecurityTicket(threatId, {
      ...analysis,
      severity,
    });

    // 6. Execute recommended action
    console.log(`⚡ Executing action: ${analysis.recommended_action}`);
    const actionResult = await executeSecurityAction(
      ticketId,
      analysis.recommended_action,
      threat
    );

    // 7. Update ticket status
    await supabase
      .from('javari_security_tickets')
      .update({
        status: 'resolved',
        resolution_notes: actionResult.message,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    // 8. Learn from this incident
    await javariLearnFromThreat(threat, analysis);

    console.log(`✅ Javari successfully handled threat ${threatId}`);

    return {
      success: true,
      ticketId,
      action: analysis.recommended_action,
      message: `Threat handled successfully. Confidence: ${(analysis.confidence_score * 100).toFixed(0)}%`,
    };
  } catch (error: any) {
    logError('❌ Error handling threat:\', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

// ============================================================================
// JAVARI LEARNING SYSTEM
// ============================================================================

async function javariLearnFromThreat(
  threat: any,
  analysis: any
): Promise<void> {
  // Extract pattern signature from the threat
  const signature = extractPatternSignature(threat);

  // Check if we've seen this pattern before
  const { data: existing } = await supabase
    .from('javari_security_learning')
    .select('id, times_seen, times_blocked, false_positives')
    .eq('pattern_signature', signature)
    .eq('threat_type', threat.threat_type)
    .single();

  if (existing) {
    // Update existing pattern
    const wasBlocked = analysis.recommended_action === 'block_immediately';
    
    await supabase
      .from('javari_security_learning')
      .update({
        times_seen: existing.times_seen + 1,
        times_blocked: wasBlocked ? existing.times_blocked + 1 : existing.times_blocked,
        effectiveness_score: calculateEffectiveness(existing, wasBlocked),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    // Learn new pattern
    await supabase.from('javari_security_learning').insert({
      pattern_type: threat.threat_type,
      pattern_signature: signature,
      threat_type: threat.threat_type,
      confidence_score: analysis.confidence_score,
      times_seen: 1,
      times_blocked: analysis.recommended_action === 'block_immediately' ? 1 : 0,
      effectiveness_score: analysis.confidence_score,
      learned_from: {
        threat_id: threat.id,
        timestamp: new Date().toISOString(),
        analysis: analysis.reasoning,
      },
    });
  }
}

function extractPatternSignature(threat: any): string {
  // Create a unique signature for this threat pattern
  const url = threat.request_url.toLowerCase();
  const body = JSON.stringify(threat.request_body || {}).toLowerCase();
  
  // Extract key indicators
  const indicators: string[] = [];
  
  if (url.includes('select') || body.includes('select')) indicators.push('sql_select');
  if (url.includes('union') || body.includes('union')) indicators.push('sql_union');
  if (url.includes('<script') || body.includes('<script')) indicators.push('xss_script');
  if (url.includes('../')) indicators.push('path_traversal');
  if (url.includes('admin')) indicators.push('admin_access');
  
  return indicators.length > 0 ? indicators.join('_') : 'generic';
}

function calculateEffectiveness(
  existing: any,
  wasBlocked: boolean
): number {
  const totalAttempts = existing.times_seen + 1;
  const successfulBlocks = wasBlocked ? existing.times_blocked + 1 : existing.times_blocked;
  const falsePositives = existing.false_positives || 0;
  
  // Effectiveness = (successful blocks - false positives) / total attempts
  const effectiveness = Math.max(0, (successfulBlocks - falsePositives) / totalAttempts);
  
  return Math.min(1, effectiveness);
}

// ============================================================================
// EXPORT
// ============================================================================

export {
  analyzeThreatWithAI,
  createSecurityTicket,
  executeSecurityAction,
  blockIP,
  activateHoneypot,
  calculateThreatSeverity,
};
