// configs.ts - Layout configuration templates
export const CONFIGS = {
    // Standard D&D 5e character sheet
    standard: {
        name: 'Standard 5e Sheet',
        sectionsPerPage: 20,
        sections: [
            {
                component: 'header',
                fields: ['name', 'class', 'level', 'race', 'background', 'alignment'],
            },
            {
                component: 'columns',
                ratio: '2fr 1fr',
                left: [
                    {
                        component: 'abilityScores',
                        abilities: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
                    },
                    {
                        component: 'proficiencyBlock',
                    },
                    {
                        component: 'savingThrows',
                    },
                    {
                        component: 'skills',
                    },
                ],
                right: [
                    {
                        component: 'combatStats',
                        showDeathSaves: true,
                    },
                ],
            },
            {
                component: 'equipment',
                title: 'Equipment & Gear',
            },
            {
                component: 'features',
                title: 'Features & Traits',
            },
        ],
    },
    // Minimal character sheet
    minimal: {
        name: 'Minimal Sheet',
        sectionsPerPage: 10,
        sections: [
            {
                component: 'header',
                fields: ['name', 'class', 'level', 'race'],
            },
            {
                component: 'abilityScores',
                abilities: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
            },
            {
                component: 'combatStats',
                showDeathSaves: false,
            },
            {
                component: 'skills',
                title: 'Key Skills',
            },
            {
                component: 'equipment',
                title: 'Equipment',
            },
        ],
    },
    // Detailed character sheet with more sections
    detailed: {
        name: 'Detailed Sheet',
        sectionsPerPage: 15,
        sections: [
            {
                component: 'header',
                fields: ['name', 'class', 'level', 'race', 'background', 'alignment', 'experiencePoints'],
            },
            {
                component: 'columns',
                ratio: '1fr 1fr',
                left: [
                    {
                        component: 'abilityScores',
                        abilities: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
                    },
                    {
                        component: 'savingThrows',
                    },
                ],
                right: [
                    {
                        component: 'combatStats',
                        showDeathSaves: true,
                    },
                    {
                        component: 'proficiencyBlock',
                    },
                ],
            },
            {
                component: 'skills',
                title: 'Skills',
            },
            {
                component: 'equipment',
                title: 'Equipment & Treasure',
            },
            {
                component: 'features',
                title: 'Features & Traits',
            },
            {
                component: 'textArea',
                title: 'Personality Traits',
                field: 'personalityTraits',
            },
            {
                component: 'textArea',
                title: 'Backstory',
                field: 'backstory',
            },
        ],
    },
};
