// Copiado desde root/learning_system.js
(function(global){
    const LearningSystem = {
        knowledge: {},
        experience: 0,
        knowledgeAreas: { 'mathematics': 0, 'programming': 0, 'physics': 0, 'chemistry': 0, 'general': 0 },
        conversationPatterns: [],
        recordExperience(area, difficulty = 1){ if (this.knowledgeAreas[area] !== undefined){ this.knowledgeAreas[area] += difficulty; this.experience += difficulty; Logger?.info(`Experience recorded: ${area}`, { level: this.knowledgeAreas[area], total: this.experience }); } },
        analyzePattern(message, response){ const pattern = { timestamp: new Date().toISOString(), messageLength: message.length, responseLength: response.length, hasQuestion: message.includes('?'), hasCode: /[{};\/\/]/.test(response), hasMath: /[+\-*/()\d.^]/.test(message) }; this.conversationPatterns.push(pattern); if (this.conversationPatterns.length > 100){ this.conversationPatterns.shift(); } },
        suggestFocus(){ if (this.conversationPatterns.length < 5) return null; const recent = this.conversationPatterns.slice(-10); const mathCount = recent.filter(p => p.hasMath).length; const codeCount = recent.filter(p => p.hasCode).length; const questionCount = recent.filter(p => p.hasQuestion).length; if (mathCount >= codeCount) return 'mathematics'; return 'programming'; },
        getExpertiseLevel(){ const total = Object.values(this.knowledgeAreas).reduce((a, b) => a + b, 0); if (total < 10) return 'beginner'; if (total < 50) return 'intermediate'; if (total < 100) return 'advanced'; return 'expert'; },
        adaptResponseQuality(baseQuality){ const expertiseMultiplier = Math.min(this.experience / 100, 1.5); return baseQuality * expertiseMultiplier; },
        getStats(){ return { totalExperience: this.experience, knowledgeAreas: this.knowledgeAreas, expertiseLevel: this.getExpertiseLevel(), patternsAnalyzed: this.conversationPatterns.length, suggestedFocus: this.suggestFocus() }; }
    };
    global.LearningSystem = LearningSystem;
})(window);
