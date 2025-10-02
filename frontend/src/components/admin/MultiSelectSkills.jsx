import React, { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'

const MultiSelectSkills = ({ 
  availableSkills = [], 
  selectedSkills = [], 
  onSelectionChange, 
  onAddNewSkill,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddNew, setShowAddNew] = useState(false)
  const [newSkillData, setNewSkillData] = useState({ name: '', logoSvg: '', category: 'Other' })
  const dropdownRef = useRef(null)

  // Filter skills based on search term
  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.some(selected => selected.skillId === skill.id)
  )

  // Group skills by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowAddNew(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSkillSelect = (skill) => {
    const newSelection = [...selectedSkills, { skillId: skill.id, level: 50, skill }]
    onSelectionChange(newSelection)
    setSearchTerm('')
  }

  const handleSkillRemove = (skillId) => {
    const newSelection = selectedSkills.filter(s => s.skillId !== skillId)
    onSelectionChange(newSelection)
  }

  const handleLevelChange = (skillId, level) => {
    const newSelection = selectedSkills.map(s =>
      s.skillId === skillId ? { ...s, level: parseInt(level) } : s
    )
    onSelectionChange(newSelection)
  }

  const handleAddNewSkill = async () => {
    if (!newSkillData.name.trim() || !newSkillData.logoSvg.trim()) {
      return
    }

    try {
      await onAddNewSkill(newSkillData)
      setNewSkillData({ name: '', logoSvg: '', category: 'Other' })
      setShowAddNew(false)
    } catch (error) {
      console.error('Error adding new skill:', error)
    }
  }

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'Tools', 'Design', 'Testing', 'Other']

  return (
    <div className="space-y-4">
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Selected Skills</h4>
          <div className="space-y-2">
            {selectedSkills.map((selectedSkill) => (
              <div key={selectedSkill.skillId} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {selectedSkill.skill?.logoSvg ? (
                      <span
                        className="w-6 h-6"
                        dangerouslySetInnerHTML={{ __html: selectedSkill.skill.logoSvg }}
                      />
                    ) : (
                      <img 
                        src={selectedSkill.skill?.logoUrl} 
                        alt={selectedSkill.skill?.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    <span className="text-white font-medium">{selectedSkill.skill?.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                      {selectedSkill.skill?.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(selectedSkill.skillId)}
                    disabled={disabled}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="text-sm text-gray-300">Level:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedSkill.level}
                    onChange={(e) => handleLevelChange(selectedSkill.skillId, e.target.value)}
                    disabled={disabled}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-300 w-12">{selectedSkill.level}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Selector */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Add Skills
        </label>
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-left focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-between"
        >
          <span className="text-gray-400">Select skills...</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-600">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            {/* Add New Skill Button */}
            <div className="p-2 border-b border-gray-600">
              <button
                type="button"
                onClick={() => setShowAddNew(!showAddNew)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-green-400 hover:bg-gray-700 rounded transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Add New Skill</span>
              </button>
            </div>

            {/* Add New Skill Form */}
            {showAddNew && (
              <div className="p-3 border-b border-gray-600 bg-gray-750">
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={newSkillData.name}
                      onChange={(e) => setNewSkillData({ ...newSkillData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Paste raw SVG markup here"
                      value={newSkillData.logoSvg}
                      onChange={(e) => setNewSkillData({ ...newSkillData, logoSvg: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-green-400"
                    />
                    <p className="mt-1 text-xs text-gray-400">Tip: Use official SVG from the technology's brand assets.</p>
                  </div>
                  <div>
                    <select
                      value={newSkillData.category}
                      onChange={(e) => setNewSkillData({ ...newSkillData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-green-400"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleAddNewSkill}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddNew(false)}
                      className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Skills List */}
            <div className="max-h-64 overflow-y-auto">
              {Object.keys(groupedSkills).length === 0 ? (
                <div className="p-3 text-gray-400 text-sm text-center">
                  {searchTerm ? 'No skills found' : 'No available skills'}
                </div>
              ) : (
                Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <div className="px-3 py-2 bg-gray-750 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {category}
                    </div>
                    {skills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillSelect(skill)}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 transition-colors text-left"
                      >
                        {skill.logoSvg ? (
                          <span
                            className="w-5 h-5"
                            dangerouslySetInnerHTML={{ __html: skill.logoSvg }}
                          />
                        ) : (
                          <img 
                            src={skill.logoUrl} 
                            alt={skill.name}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                        <span className="text-white text-sm">{skill.name}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelectSkills
