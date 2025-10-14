/**
 * Service for managing conditional loading of third-party scripts based on cookie consent
 */

import { CONSENT_CATEGORIES } from '../contexts/ConsentContext';

// Configuration for third-party scripts
const SCRIPTS_CONFIG = {
  googleAnalytics: {
    category: CONSENT_CATEGORIES.ANALYTICS,
    id: 'google-analytics',
    src: 'https://www.googletagmanager.com/gtag/js?id=G-8GQ7ZLB9VK',
    init: () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(){window.dataLayer.push(arguments);}
      window.gtag('js', new Date());
      window.gtag('config', 'G-8GQ7ZLB9VK');
      console.log('Google Analytics loaded with consent');
    }
  }
  // Add more scripts here as needed (Facebook Pixel, etc.)
};

class ScriptManager {
  constructor() {
    this.loadedScripts = new Set();
  }

  /**
   * Load a script if consent is given for its category
   * @param {string} scriptName - Name of script from SCRIPTS_CONFIG
   * @param {Object} consent - Current consent state
   */
  loadScript(scriptName, consent) {
    const config = SCRIPTS_CONFIG[scriptName];
    if (!config) {
      console.warn(`Unknown script: ${scriptName}`);
      return;
    }

    // Check if consent is given for this script's category
    if (!consent[config.category]) {
      console.log(`Consent not given for ${scriptName} (${config.category})`);
      return;
    }

    // Check if script is already loaded
    if (this.loadedScripts.has(scriptName)) {
      console.log(`Script ${scriptName} already loaded`);
      return;
    }

    // Load the script
    this.injectScript(config)
      .then(() => {
        this.loadedScripts.add(scriptName);
        if (config.init) {
          config.init();
        }
      })
      .catch((error) => {
        console.error(`Failed to load ${scriptName}:`, error);
      });
  }

  /**
   * Remove a script if consent is revoked
   * @param {string} scriptName - Name of script to remove
   */
  removeScript(scriptName) {
    const config = SCRIPTS_CONFIG[scriptName];
    if (!config) {
      return;
    }

    // Remove script element
    const existingScript = document.getElementById(config.id);
    if (existingScript) {
      existingScript.remove();
    }

    // Clean up global variables for Google Analytics
    if (scriptName === 'googleAnalytics') {
      if (window.gtag) {
        delete window.gtag;
      }
      if (window.dataLayer) {
        window.dataLayer = [];
      }
    }

    this.loadedScripts.delete(scriptName);
    console.log(`Script ${scriptName} removed due to consent revocation`);
  }

  /**
   * Inject script element into document head
   * @param {Object} config - Script configuration
   * @returns {Promise} - Resolves when script loads
   */
  injectScript(config) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = config.id;
      script.src = config.src;
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${config.src}`));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Update scripts based on current consent state
   * @param {Object} consent - Current consent state
   * @param {Object} previousConsent - Previous consent state
   */
  updateScripts(consent, previousConsent = {}) {
    Object.keys(SCRIPTS_CONFIG).forEach(scriptName => {
      const config = SCRIPTS_CONFIG[scriptName];
      const hasConsent = consent[config.category];
      const hadConsent = previousConsent[config.category];

      if (hasConsent && !hadConsent) {
        // Consent was granted, load script
        this.loadScript(scriptName, consent);
      } else if (!hasConsent && hadConsent) {
        // Consent was revoked, remove script
        this.removeScript(scriptName);
      }
    });
  }

  /**
   * Get list of scripts that would be loaded for given consent
   * @param {Object} consent - Consent state to check
   * @returns {Array} - Array of script names that would be loaded
   */
  getEnabledScripts(consent) {
    return Object.keys(SCRIPTS_CONFIG).filter(scriptName => {
      const config = SCRIPTS_CONFIG[scriptName];
      return consent[config.category];
    });
  }
}

// Export singleton instance
export const scriptManager = new ScriptManager();

export default scriptManager;