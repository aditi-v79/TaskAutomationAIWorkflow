declare module '@vue-flow/core' {
    import { App } from 'vue';
    export const VueFlow: {
      install(app: App): void;
      registerNode(name: string, options: { component: Component }): void; 
    };
  }