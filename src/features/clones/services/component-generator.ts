import type { 
  ComponentAnalysis, 
  GeneratedFile, 
  GenerationOptions, 
  WebsiteAnalysis, 
  GenerationResult, 
  GeneratedComponent 
} from '../types';

export class ComponentGenerator {
  
  /**
   * React component kodini generate qiladi
   */
  generateReactComponent(
    component: ComponentAnalysis, 
    options: GenerationOptions
  ): GeneratedFile {
    const code = this.buildComponentCode(component, options);
    
    return {
      path: `src/components/${this.kebabCase(component.name)}.tsx`,
      content: code,
      type: 'component',
      description: component.description
    };
  }

  /**
   * Component uchun TypeScript interface yaratadi
   */
  generateComponentTypes(component: ComponentAnalysis): GeneratedFile {
    const typeCode = this.buildTypeDefinitions(component);
    
    return {
      path: `src/types/${this.kebabCase(component.name)}.types.ts`,
      content: typeCode,
      type: 'type',
      description: `Type definitions for ${component.name} component`
    };
  }

  /**
   * Component styling file yaratadi
   */
  generateComponentStyles(
    component: ComponentAnalysis, 
    options: GenerationOptions
  ): GeneratedFile | null {
    if (options.styling === 'tailwind') {
      return null; // Tailwind uchun alohida CSS file kerak emas
    }

    const styleCode = this.buildStyleCode(component, options);
    const extension = this.getStyleExtension(options.styling);
    
    return {
      path: `src/styles/${this.kebabCase(component.name)}.${extension}`,
      content: styleCode,
      type: 'style',
      description: `Styles for ${component.name} component`
    };
  }

  /**
   * React component kodini yaratadi
   */
  private buildComponentCode(
    component: ComponentAnalysis, 
    options: GenerationOptions
  ): string {
    const { name, props, styling, children, functionality } = component;
    const propsInterface = this.generatePropsInterface(props, options.typescript);
    const imports = this.generateImports(component, options);
    const componentBody = this.generateComponentBody(component, options);
    
    return `${imports}

${options.typescript ? propsInterface : ''}

export ${options.typescript ? `const ${name}: React.FC<${name}Props> = (` : `function ${name}(`}${this.generatePropsDestructuring(props)}) => {
${componentBody}
};

export default ${name};
`;
  }

  /**
   * Import statements yaratadi
   */
  private generateImports(component: ComponentAnalysis, options: GenerationOptions): string {
    const imports = ['import React from \'react\';'];
    
    if (options.typescript && component.children?.length) {
      imports.push('import type { ReactNode } from \'react\';');
    }
    
    if (options.styling === 'styled-components') {
      imports.push('import styled from \'styled-components\';');
    } else if (options.styling === 'css-modules') {
      imports.push(`import styles from './${this.kebabCase(component.name)}.module.css';`);
    }
    
    // Agar lucide-react iconlar ishlatilsa
    if (component.functionality.includes('icon')) {
      imports.push('import { ChevronDown, Menu, Search, User } from \'lucide-react\';');
    }
    
    return imports.join('\n');
  }

  /**
   * Props interface yaratadi
   */
  private generatePropsInterface(props: ComponentAnalysis['props'], typescript: boolean): string {
    if (!typescript || !props.length) return '';
    
    const propsDefinition = props.map(prop => {
      const optional = prop.required ? '' : '?';
      return `  ${prop.name}${optional}: ${prop.type};`;
    }).join('\n');
    
    return `interface ${this.pascalCase(props[0]?.name.split('Props')[0] || 'Component')}Props {
${propsDefinition}
  children?: ReactNode;
}`;
  }

  /**
   * Props destructuring yaratadi
   */
  private generatePropsDestructuring(props: ComponentAnalysis['props']): string {
    if (!props.length) return '{ children }';
    
    const propNames = props.map(prop => prop.name);
    return `{ ${propNames.join(', ')}, children }`;
  }

  /**
   * Component body yaratadi
   */
  private generateComponentBody(component: ComponentAnalysis, options: GenerationOptions): string {
    const { type, styling, functionality } = component;
    
    let jsx = this.generateJSX(component, options);
    
    // State management
    const stateLogic = this.generateStateLogic(functionality);
    
    // Event handlers
    const eventHandlers = this.generateEventHandlers(functionality);
    
    return `${stateLogic}${eventHandlers}
  return (
${jsx}
  );`;
  }

  /**
   * JSX kodini yaratadi
   */
  private generateJSX(component: ComponentAnalysis, options: GenerationOptions): string {
    const { type, styling } = component;
    const className = this.generateClassName(component, options);
    
    let jsx = '';
    
    switch (type) {
      case 'navigation':
        jsx = this.generateNavigationJSX(component, className);
        break;
      case 'button':
        jsx = this.generateButtonJSX(component, className);
        break;
      case 'form':
        jsx = this.generateFormJSX(component, className);
        break;
      case 'layout':
        jsx = this.generateLayoutJSX(component, className);
        break;
      default:
        jsx = this.generateGenericJSX(component, className);
    }
    
    return jsx;
  }

  /**
   * Navigation JSX yaratadi
   */
  private generateNavigationJSX(component: ComponentAnalysis, className: string): string {
    return `    <nav className="${className}">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold">Logo</div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="hover:text-primary">Home</a>
              <a href="#" className="hover:text-primary">About</a>
              <a href="#" className="hover:text-primary">Services</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="md:hidden">
            <Menu className="h-6 w-6" />
          </div>
        </div>
      </div>
    </nav>`;
  }

  /**
   * Button JSX yaratadi
   */
  private generateButtonJSX(component: ComponentAnalysis, className: string): string {
    return `    <button 
      className="${className}"
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>`;
  }

  /**
   * Form JSX yaratadi
   */
  private generateFormJSX(component: ComponentAnalysis, className: string): string {
    return `    <form className="${className}" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input 
            type="email" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
        >
          Submit
        </button>
      </div>
    </form>`;
  }

  /**
   * Layout JSX yaratadi
   */
  private generateLayoutJSX(component: ComponentAnalysis, className: string): string {
    return `    <div className="${className}">
      {children}
    </div>`;
  }

  /**
   * Generic JSX yaratadi
   */
  private generateGenericJSX(component: ComponentAnalysis, className: string): string {
    return `    <div className="${className}">
      {children}
    </div>`;
  }

  /**
   * State logic yaratadi
   */
  private generateStateLogic(functionality: string[]): string {
    let state = '';
    
    if (functionality.includes('toggle')) {
      state += '  const [isOpen, setIsOpen] = useState(false);\n';
    }
    
    if (functionality.includes('form')) {
      state += '  const [formData, setFormData] = useState({});\n';
    }
    
    if (functionality.includes('loading')) {
      state += '  const [isLoading, setIsLoading] = useState(false);\n';
    }
    
    return state ? `  // State management\n${state}\n` : '';
  }

  /**
   * Event handlers yaratadi
   */
  private generateEventHandlers(functionality: string[]): string {
    let handlers = '';
    
    if (functionality.includes('click')) {
      handlers += '  const handleClick = () => {\n    // Handle click\n  };\n\n';
    }
    
    if (functionality.includes('submit')) {
      handlers += '  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    // Handle form submission\n  };\n\n';
    }
    
    if (functionality.includes('toggle')) {
      handlers += '  const handleToggle = () => {\n    setIsOpen(!isOpen);\n  };\n\n';
    }
    
    return handlers ? `  // Event handlers\n${handlers}` : '';
  }

  /**
   * CSS class name yaratadi
   */
  private generateClassName(component: ComponentAnalysis, options: GenerationOptions): string {
    if (options.styling === 'tailwind') {
      return this.generateTailwindClasses(component);
    }
    if (options.styling === 'css-modules') {
      return `\${styles.${this.camelCase(component.name)}}`;
    }
    
    return this.kebabCase(component.name);
  }

  /**
   * Tailwind CSS classes yaratadi
   */
  private generateTailwindClasses(component: ComponentAnalysis): string {
    const { type, styling } = component;
    const baseClasses = [];
    
    // Type ga qarab base classes
    switch (type) {
      case 'navigation':
        baseClasses.push('bg-white shadow-lg border-b');
        break;
      case 'button':
        baseClasses.push('px-4 py-2 rounded-md font-medium transition-colors');
        break;
      case 'form':
        baseClasses.push('max-w-md mx-auto bg-white p-6 rounded-lg shadow-md');
        break;
      case 'layout':
        baseClasses.push('container mx-auto px-4');
        break;
      default:
        baseClasses.push('block');
    }
    
    // Styling ma'lumotlariga qarab qo'shimcha classes
    if (styling.colors.primary.length) {
      baseClasses.push('text-primary');
    }
    
    return baseClasses.join(' ');
  }

  /**
   * Type definitions yaratadi
   */
  private buildTypeDefinitions(component: ComponentAnalysis): string {
    const { name, props } = component;
    
    return `export interface ${name}Props {
${props.map(prop => `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`).join('\n')}
  children?: React.ReactNode;
}

export interface ${name}State {
  // Add state interface if needed
}
`;
  }

  /**
   * Style kod yaratadi
   */
  private buildStyleCode(component: ComponentAnalysis, options: GenerationOptions): string {
    const { styling } = component;
    
    if (options.styling === 'css-modules') {
      return this.generateCSSModules(component);
    }
    if (options.styling === 'styled-components') {
      return this.generateStyledComponents(component);
    }
    
    return '';
  }

  /**
   * CSS Modules yaratadi
   */
  private generateCSSModules(component: ComponentAnalysis): string {
    const className = this.camelCase(component.name);
    
    return `.${className} {
  /* Add your styles here */
  display: block;
}`;
  }

  /**
   * Styled Components yaratadi
   */
  private generateStyledComponents(component: ComponentAnalysis): string {
    return `import styled from 'styled-components';

export const Styled${component.name} = styled.div\`
  /* Add your styles here */
  display: block;
\`;`;
  }

  /**
   * Style file extension oladi
   */
  private getStyleExtension(styling: string): string {
    switch (styling) {
      case 'css-modules':
        return 'module.css';
      case 'styled-components':
        return 'styled.ts';
      default:
        return 'css';
    }
  }

  /**
   * Website analysis asosida barcha komponentlarni generate qiladi
   */
  async generateComponents(
    analysis: WebsiteAnalysis, 
    options: GenerationOptions
  ): Promise<GenerationResult> {
    const components: GeneratedComponent[] = [];
    const files: GeneratedFile[] = [];

    try {
      // Har bir komponent uchun kod generate qilish
      for (const component of analysis.components) {
        // React component
        const componentFile = this.generateReactComponent(component, options);
        files.push(componentFile);

        // Component kod va ma'lumotlarini saqlash
        components.push({
          name: component.name,
          code: componentFile.content,
          type: component.type,
          description: component.description,
          dependencies: component.dependencies
        });

        // Type definitions
        if (options.typescript) {
          const typeFile = this.generateComponentTypes(component);
          files.push(typeFile);
        }

        // Styles
        const styleFile = this.generateComponentStyles(component, options);
        if (styleFile) {
          files.push(styleFile);
        }
      }

      return {
        components,
        files,
        success: true,
        message: `${components.length} ta komponent muvaffaqiyatli yaratildi`,
        generatedAt: new Date()
      };

    } catch (error) {
      return {
        components: [],
        files: [],
        success: false,
        message: `Komponent yaratishda xato: ${error instanceof Error ? error.message : 'Noma\'lum xato'}`,
        generatedAt: new Date()
      };
    }
  }

  // Utility methods
  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private camelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  private pascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + this.camelCase(str).slice(1);
  }
}
