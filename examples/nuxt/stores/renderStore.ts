import { defineStore } from 'pinia';

type ComponentType =  'counter' | 'toggle' | 'input' | 'list';

export const useRenderStore = defineStore('render', {
  state: () => ({
    totalRenders: 0,
    activeComponents: 4,
    renderFrequency: '0.0',
    renderTimeline: [] as Array<{
      type: ComponentType;
      color: string;
      height: number;
      position: number;
      timestamp: number;
    }>,
    lastRenders: [] as Array<{ componentType: ComponentType; timestamp: number }>,
    componentRenders: {
      counter: 0,
      toggle: 0,
      input: 0,
      list: 0
    }
  }),
  
  actions: {
    trackRender(componentType: ComponentType) {
      // Increment total renders
      this.totalRenders++;
      
      // Update component-specific counts in the store
      if (componentType && this.componentRenders[componentType] !== undefined) {
        this.componentRenders[componentType]++;
      }
      
      // Add to recent renders for frequency calculation
      this.lastRenders.push({
        componentType,
        timestamp: Date.now()
      });
      
      // Update render timeline
      this.addToTimeline(componentType);
      
      // Update render frequency
      this.calculateRenderFrequency();
    },
    
    addToTimeline(componentType: ComponentType) {
      // Define colors for different component types
      const colors = {
        counter: 'rgb(16, 185, 129)', // green
        toggle: 'rgb(59, 130, 246)',  // blue
        input: 'rgb(168, 85, 247)',   // purple
        list: 'rgb(245, 158, 11)'     // amber
      };
      
      const height = Math.max(20, Math.min(80, Math.random() * 40 + 20));
      const position = Math.random() * 100;
      
      this.renderTimeline.push({
        type: componentType,
        color: colors[componentType] || 'rgb(156, 163, 175)', // gray default
        height,
        position,
        timestamp: Date.now()
      });
      
      // Limit timeline to 50 items
      if (this.renderTimeline.length > 50) {
        this.renderTimeline.shift();
      }
    },
    
    calculateRenderFrequency() {
      const now = Date.now();
      // Count renders in the last 10 seconds
      const recentRenders = this.lastRenders.filter(r => now - r.timestamp < 10000).length;
      this.renderFrequency = (recentRenders / 10).toFixed(1);
      
      // Clean up old render entries
      this.lastRenders = this.lastRenders.filter(r => now - r.timestamp < 10000);
    },
    
    resetStats() {
      this.totalRenders = 0;
      this.renderFrequency = '0.0';
      this.renderTimeline = [];
      this.lastRenders = [];
      
      // Reset component counters
      Object.keys(this.componentRenders).forEach((key) => {
        this.componentRenders[key as ComponentType] = 0;
      });
    }
  }
});