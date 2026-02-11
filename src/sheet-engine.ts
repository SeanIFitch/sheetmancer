// sheet-engine.ts - Core rendering engine for character sheets

import { CharacterData, Theme, Config, SectionConfig, SheetGenerationResult, Page, Component } from './types';

export class SheetEngine {
  private components: Record<string, Component>;
  private componentNames: string;

  constructor(components: Record<string, Component>) {
    this.components = components;
    this.componentNames = Object.keys(components).join(', ');
  }

  generate(config: Config, theme: Theme, data: CharacterData): SheetGenerationResult {
    // Input validation
    if (!config || !config.sections) {
      throw new Error('Invalid config: config and config.sections are required');
    }
    if (!theme) {
      throw new Error('Invalid theme: theme is required');
    }
    if (!data) {
      throw new Error('Invalid data: data is required');
    }

    const html = this.renderSheet(config, theme, data);
    const styles = this.generateStyles(theme);
    return { html, styles };
  }

  private renderSheet(config: Config, theme: Theme, data: CharacterData): string {
    const pages = this.layoutPages(config, data);

    return pages
      .map(
        (page, index) =>
          `<div class="character-sheet-page" data-page="${index + 1}">
                ${this.renderSections(page.sections, theme, data)}
            </div>`
      )
      .join('');
  }

  private layoutPages(config: Config, _data: CharacterData): Page[] {
    // Simple pagination - distribute sections across pages
    // In a more advanced version, this would measure content height
    const sectionsPerPage = config.sectionsPerPage || config.sections.length;
    const pages: Page[] = [];

    for (let i = 0; i < config.sections.length; i += sectionsPerPage) {
      pages.push({
        sections: config.sections.slice(i, i + sectionsPerPage),
      });
    }

    return pages;
  }

  private renderSections(sections: SectionConfig[], theme: Theme, data: CharacterData): string {
    return sections
      .map((section) => {
        if (!section || !section.component) {
          console.warn('Invalid section config: missing component name');
          return '';
        }

        const component = this.components[section.component];
        if (!component) {
          console.warn(`Component '${section.component}' not found. Available components: ${this.componentNames}`);
          return '';
        }

        try {
          return component.render(section, theme, data);
        } catch (error) {
          console.error(`Error rendering component '${section.component}':`, error);
          return `<div class="sheet-section error">Error rendering ${section.component}</div>`;
        }
      })
      .join('');
  }

  private generateStyles(theme: Theme): string {
    const t = theme;

    return `
            .character-sheet-page {
                width: ${t.page.width};
                min-height: ${t.page.height};
                background: ${t.colors.background};
                background-image: ${t.backgrounds.texture};
                padding: ${t.spacing.page};
                margin: 0 auto ${t.spacing.pageGap};
                position: relative;
                font-family: ${t.typography.body.family};
                color: ${t.colors.text};
                page-break-after: always;
                ${t.backgrounds.border ? `border: ${t.backgrounds.border};` : ''}
                ${t.backgrounds.shadow ? `box-shadow: ${t.backgrounds.shadow};` : ''}
            }

            .character-sheet-page::before {
                content: '';
                position: absolute;
                inset: 0;
                ${t.backgrounds.overlay || ''}
                pointer-events: none;
            }

            .sheet-section {
                margin-bottom: ${t.spacing.section};
                position: relative;
                z-index: 1;
            }

            .section-header {
                font-family: ${t.typography.heading.family};
                font-size: ${t.typography.heading.size};
                font-weight: ${t.typography.heading.weight};
                color: ${t.colors.primary};
                margin-bottom: ${t.spacing.small};
                padding-bottom: ${t.spacing.xsmall};
                border-bottom: ${t.borders.section};
                text-transform: ${t.typography.heading.transform || 'none'};
                letter-spacing: ${t.typography.heading.spacing || 'normal'};
            }

            .section-grid {
                display: grid;
                gap: ${t.spacing.medium};
            }

            .field-group {
                display: flex;
                flex-direction: column;
                gap: ${t.spacing.xsmall};
            }

            .field-label {
                font-size: ${t.typography.label.size};
                font-weight: ${t.typography.label.weight};
                color: ${t.colors.secondary};
                text-transform: ${t.typography.label.transform || 'uppercase'};
                letter-spacing: ${t.typography.label.spacing || '0.05em'};
            }

            .field-value {
                font-size: ${t.typography.value.size};
                font-weight: ${t.typography.value.weight};
                color: ${t.colors.text};
                padding: ${t.spacing.small};
                background: ${t.colors.fieldBackground};
                border: ${t.borders.field};
                border-radius: ${t.borders.radius};
                min-height: 2em;
            }

            .stat-block {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: ${t.spacing.medium};
            }

            .stat-item {
                text-align: center;
                padding: ${t.spacing.medium};
                background: ${t.colors.statBackground};
                border: ${t.borders.stat};
                border-radius: ${t.borders.radius};
                ${t.backgrounds.statGradient || ''}
            }

            .stat-name {
                font-size: ${t.typography.label.size};
                font-weight: ${t.typography.label.weight};
                color: ${t.colors.secondary};
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: ${t.spacing.xsmall};
            }

            .stat-value {
                font-size: ${t.typography.stat.size};
                font-weight: ${t.typography.stat.weight};
                color: ${t.colors.primary};
                line-height: 1;
            }

            .stat-modifier {
                font-size: ${t.typography.modifier.size};
                font-weight: ${t.typography.modifier.weight};
                color: ${t.colors.text};
                margin-top: ${t.spacing.xsmall};
            }

            .info-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: ${t.spacing.medium};
            }

            .skill-list {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: ${t.spacing.small};
            }

            .skill-item {
                display: flex;
                align-items: center;
                gap: ${t.spacing.small};
                padding: ${t.spacing.small};
                background: ${t.colors.fieldBackground};
                border: ${t.borders.field};
                border-radius: ${t.borders.radius};
            }

            .skill-checkbox {
                width: 16px;
                height: 16px;
                border: 2px solid ${t.colors.border};
                border-radius: 3px;
                flex-shrink: 0;
            }

            .skill-checkbox.checked {
                background: ${t.colors.primary};
                position: relative;
            }

            .skill-checkbox.checked::after {
                content: '✓';
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .skill-name {
                flex: 1;
                font-size: ${t.typography.body.size};
                color: ${t.colors.text};
            }

            .skill-bonus {
                font-weight: 600;
                color: ${t.colors.primary};
                min-width: 2em;
                text-align: center;
            }

            .equipment-list,
            .feature-list {
                display: flex;
                flex-direction: column;
                gap: ${t.spacing.xsmall};
            }

            .equipment-item,
            .feature-item {
                padding: ${t.spacing.small};
                background: ${t.colors.fieldBackground};
                border: ${t.borders.field};
                border-radius: ${t.borders.radius};
                font-size: ${t.typography.body.size};
            }

            .combat-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: ${t.spacing.medium};
            }

            .combat-stat {
                text-align: center;
                padding: ${t.spacing.medium};
                background: ${t.colors.statBackground};
                border: ${t.borders.stat};
                border-radius: ${t.borders.radius};
            }

            .hp-tracker {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: ${t.spacing.medium};
            }

            .death-saves {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: ${t.spacing.small};
                margin-top: ${t.spacing.medium};
            }

            .save-track {
                display: flex;
                gap: ${t.spacing.xsmall};
            }

            .save-bubble {
                width: 24px;
                height: 24px;
                border: 2px solid ${t.colors.border};
                border-radius: 50%;
                background: ${t.colors.fieldBackground};
            }

            .textarea-field {
                min-height: 100px;
                resize: vertical;
                font-family: ${t.typography.body.family};
            }

            /* Decorative elements */
            .ornament {
                ${t.decorative.ornament || ''}
            }

            .divider {
                height: 2px;
                background: ${t.colors.border};
                margin: ${t.spacing.medium} 0;
                ${t.decorative.divider || ''}
            }

            /* Print-specific styles */
            @media print {
                .character-sheet-page {
                    margin: 0;
                    box-shadow: none;
                    page-break-after: always;
                }

                .character-sheet-page:last-child {
                    page-break-after: auto;
                }
            }
        `;
  }

  // Helper function to calculate modifier from ability score
  static calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  static formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}
