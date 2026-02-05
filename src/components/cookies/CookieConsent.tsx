 import { useState, useEffect } from 'react';
 import { Button } from '@/components/ui/button';
 import { Cookie, Settings, X } from 'lucide-react';
 import CookiePreferences from './CookiePreferences';
 
 export interface CookieSettings {
   essential: boolean; // Always true, cannot be disabled
   analytics: boolean;
   marketing: boolean;
   functional: boolean;
 }
 
 const DEFAULT_SETTINGS: CookieSettings = {
   essential: true,
   analytics: false,
   marketing: false,
   functional: false,
 };
 
 const CookieConsent = () => {
   const [showBanner, setShowBanner] = useState(false);
   const [showPreferences, setShowPreferences] = useState(false);
   const [settings, setSettings] = useState<CookieSettings>(DEFAULT_SETTINGS);
 
   useEffect(() => {
     const consent = localStorage.getItem('cookie-consent');
     if (!consent) {
       // Small delay to not show immediately on page load
       const timer = setTimeout(() => setShowBanner(true), 1000);
       return () => clearTimeout(timer);
     } else {
       try {
         const parsed = JSON.parse(consent);
         setSettings(parsed);
       } catch {
         setShowBanner(true);
       }
     }
   }, []);
 
   const saveConsent = (newSettings: CookieSettings) => {
     localStorage.setItem('cookie-consent', JSON.stringify(newSettings));
     localStorage.setItem('cookie-consent-date', new Date().toISOString());
     setSettings(newSettings);
     setShowBanner(false);
     setShowPreferences(false);
   };
 
   const acceptAll = () => {
     saveConsent({
       essential: true,
       analytics: true,
       marketing: true,
       functional: true,
     });
   };
 
   const rejectAll = () => {
     saveConsent({
       essential: true, // Essential always stays on
       analytics: false,
       marketing: false,
       functional: false,
     });
   };
 
   if (!showBanner && !showPreferences) return null;
 
   return (
     <>
       {/* Cookie Banner */}
       {showBanner && !showPreferences && (
         <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-300">
           <div className="container mx-auto max-w-4xl">
             <div className="glass-card rounded-2xl p-6 shadow-2xl border border-border/50">
               <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                   <Cookie className="w-6 h-6 text-primary" />
                 </div>
                 
                 <div className="flex-1">
                   <h3 className="font-display font-semibold text-lg mb-2">
                     🙏 We Value Your Privacy
                   </h3>
                   <p className="text-sm text-muted-foreground mb-4">
                     We use cookies to enhance your spiritual journey on our platform. 
                     Essential cookies help the site function, while optional cookies help us 
                     improve your experience and remember your preferences.
                   </p>
                   
                   <div className="flex flex-wrap gap-3">
                     <Button 
                       onClick={acceptAll}
                       className="bg-primary hover:bg-primary/90"
                     >
                       Accept All
                     </Button>
                     <Button 
                       variant="outline" 
                       onClick={rejectAll}
                     >
                       Reject Optional
                     </Button>
                     <Button 
                       variant="ghost" 
                       onClick={() => setShowPreferences(true)}
                       className="gap-2"
                     >
                       <Settings className="w-4 h-4" />
                       Preferences
                     </Button>
                   </div>
                 </div>
 
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={rejectAll}
                   className="flex-shrink-0"
                 >
                   <X className="w-5 h-5" />
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
 
       {/* Cookie Preferences Modal */}
       <CookiePreferences
         isOpen={showPreferences}
         onClose={() => setShowPreferences(false)}
         settings={settings}
         onSave={saveConsent}
       />
     </>
   );
 };
 
 export default CookieConsent;