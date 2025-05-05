/**
 * Discovers backend server IP on local network
 * @returns {Promise<string|null>} IP address if found, null otherwise
 */
async function discoverBackendServer(port : number): Promise<string | null> {

    const lastKnownIP: string | null = localStorage.getItem('lastKnownServerIP');
    
    if (lastKnownIP && await testServer(lastKnownIP)) {
      return lastKnownIP;
    }
    

    const ipPromises = Array.from({length: 255}, (_, i) => {
        const currentIP = `192.168.1.${i+1}`;
        const url = `http://${currentIP}:${port}/ping`;
        return testServer(url).then(success => success ? currentIP : null);
    });

    // Race all promises - first success wins
    const results = await Promise.all(ipPromises);
    const foundIP = results.find(ip => ip !== null);

    if (foundIP) {
        localStorage.setItem('lastKnownServerIP', foundIP);
        return foundIP;
    }
  
    return null; // No server found
    }
  
  /**
   * Tests if a server is reachable at the given URL
   * @param {string} url 
   * @returns {Promise<boolean>}
   */
  async function testServer(url: string): Promise<boolean> {
    try {

      // timeout after 500ms
      const controller: AbortController = new AbortController();
      const timeout: NodeJS.Timeout = setTimeout(() => controller.abort(), 200);
  
      const response: Response = await fetch(url, {method: 'GET'});
  
      clearTimeout(timeout);
      
      return response.ok;
      
    } catch (error) {
      return false;
    }
  }

export { discoverBackendServer };
