import React from 'react';
import { Users, UserPlus, X, Eye, EyeOff } from 'lucide-react';

export default function TeamForm({ team, setTeam, visibility, toggleVisibility }) {
  const addTeamMember = () => {
    setTeam(prev => [...prev, { id: Date.now(), name: '', role: 'Event Coordinator' }]);
  };

  const removeTeamMember = (id) => {
    if (team.length <= 1) return;
    setTeam(prev => prev.filter(member => member.id !== id));
  };

  const handleMemberChange = (id, field, value) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const getInitials = (name) => {
    if (!name) return 'TM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`glass-card ${!visibility.teamSection ? 'section-hidden' : ''}`}>
      <div className="section-title">
        <div className="section-title-left">
          <Users size={20} />
          <span>4. Assigned Corporate Team</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Section visibility toggle */}
          <button
            type="button"
            className={`vis-toggle-btn ${visibility.teamSection ? 'visible' : 'hidden'}`}
            onClick={() => toggleVisibility('teamSection')}
            title={visibility.teamSection ? 'Hide Team section from document' : 'Show Team section on document'}
          >
            {visibility.teamSection ? <Eye size={13} /> : <EyeOff size={13} />}
            {visibility.teamSection ? 'Team Visible' : 'Team Hidden'}
          </button>

          {visibility.teamSection && (
            <button type="button" className="btn btn-outline btn-sm" onClick={addTeamMember}>
              <UserPlus size={14} /> Add Member
            </button>
          )}
        </div>
      </div>

      <div className={visibility.teamSection ? '' : 'field-hidden-wrap'}>
        <div className="team-grid">
          {team.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-info">
                <input 
                  type="text" className="team-name-input" 
                  placeholder="Team Member Name" 
                  value={member.name} 
                  onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)} 
                />
                <input 
                  type="text" className="team-role-input" 
                  placeholder="Role (e.g. Lead Director)" 
                  value={member.role} 
                  onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)} 
                />
              </div>
              <button 
                type="button" className="remove-team-btn" 
                onClick={() => removeTeamMember(member.id)}
                disabled={team.length <= 1}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
