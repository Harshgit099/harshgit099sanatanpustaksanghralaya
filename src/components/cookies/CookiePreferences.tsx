 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
 import { Label } from '@/components/ui/label';
 import { Cookie, Shield, BarChart3, Megaphone, Cog } from 'lucide-react';
 import { useState, useEffect } from 'react';
 import type { CookieSettings } from './CookieConsent';
 
 interface CookiePreferencesProps {
   isOpen: boolean;
   onClose: () => void;
   settings: CookieSettings;
   onSave: (settings: CookieSettings) => void;
 }
 
 const cookieTypes = [
   {
     key: 'essential' as const,
     icon: Shield,
     title: 'Essential Cookies',
     description: 'Required for the website to function properly. Cannot be disabled.',
     required: true,
   },
   {
     key: 'functional' as const,
     icon: Cog,
     title: 'Functional Cookies',
     description: 'Remember your preferences like language, theme, and reading progress.',
     required: false,
   },
   {
     key: 'analytics' as const,
     icon: BarChart3,
     title: 'Analytics Cookies',
     description: 'Help us understand how visitors interact with the website to improve it.',
     required: false,
   },
   {
     key: 'marketing' as const,
     icon: Megaphone,
     title: 'Marketing Cookies',
     description: 'Used to deliver personalized content and measure campaign effectiveness.',
     required: false,
   },
 ];
 
 const CookiePreferences = ({ isOpen, onClose, settings, onSave }: CookiePreferencesProps) => {
   const [localSettings, setLocalSettings] = useState<CookieSettings>(settings);
 
   useEffect(() => {
     setLocalSettings(settings);
   }, [settings]);
 
   const handleToggle = (key: keyof CookieSettings) => {
     if (key === 'essential') return; // Cannot toggle essential
     setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
   };
 
   const handleSave = () => {
     onSave(localSettings);
   };
 
   const acceptAll = () => {
     onSave({
       essential: true,
       analytics: true,
       marketing: true,
       functional: true,
     });
   };
 
   return (
     <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
               <Cookie className="w-5 h-5 text-primary" />
             </div>
             <DialogTitle className="font-display text-xl">Cookie Preferences</DialogTitle>
           </div>
           <DialogDescription>
             Customize which cookies you allow. Essential cookies are always enabled for the site to work properly.
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4 py-4">
           {cookieTypes.map(({ key, icon: Icon, title, description, required }) => (
             <div
               key={key}
               className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
             >
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                 <Icon className="w-5 h-5 text-primary" />
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <Label htmlFor={key} className="font-medium cursor-pointer">
                     {title}
                   </Label>
                   <Switch
                     id={key}
                     checked={localSettings[key]}
                     onCheckedChange={() => handleToggle(key)}
                     disabled={required}
                     className={required ? 'opacity-50' : ''}
                   />
                 </div>
                 <p className="text-sm text-muted-foreground">
                   {description}
                 </p>
                 {required && (
                   <span className="text-xs text-primary font-medium mt-1 inline-block">
                     Always Active
                   </span>
                 )}
               </div>
             </div>
           ))}
         </div>
 
         <DialogFooter className="flex-col sm:flex-row gap-2">
           <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
             Cancel
           </Button>
           <Button variant="secondary" onClick={handleSave} className="w-full sm:w-auto">
             Save Preferences
           </Button>
           <Button onClick={acceptAll} className="w-full sm:w-auto">
             Accept All
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default CookiePreferences;