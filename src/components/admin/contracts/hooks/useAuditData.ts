
import { useState, useEffect } from 'react';

interface AuditData {
  ip_address: string | null;
  user_agent: string | null;
}

export const useAuditData = () => {
  const [auditData, setAuditData] = useState<AuditData>({
    ip_address: null,
    user_agent: null
  });

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        // Capturar User Agent
        const userAgent = navigator.userAgent;

        // Capturar IP Address
        let ipAddress = null;
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        } catch (error) {
          console.warn('Could not fetch IP address:', error);
          ipAddress = 'unknown';
        }

        setAuditData({
          ip_address: ipAddress,
          user_agent: userAgent
        });
      } catch (error) {
        console.error('Error fetching audit data:', error);
        setAuditData({
          ip_address: 'unknown',
          user_agent: navigator.userAgent
        });
      }
    };

    fetchAuditData();
  }, []);

  return auditData;
};
