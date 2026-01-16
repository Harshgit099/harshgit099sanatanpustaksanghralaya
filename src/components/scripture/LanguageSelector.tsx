import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Translation {
  id: string;
  language: string | null;
  title: string;
}

interface LanguageSelectorProps {
  currentLanguage: string | null;
  translations: Translation[];
  onLanguageChange: (scriptureId: string) => void;
}

const languageLabels: Record<string, string> = {
  sanskrit: 'संस्कृत (Sanskrit)',
  hindi: 'हिंदी (Hindi)',
  english: 'English',
  tamil: 'தமிழ் (Tamil)',
  telugu: 'తెలుగు (Telugu)',
  kannada: 'ಕನ್ನಡ (Kannada)',
  malayalam: 'മലയാളം (Malayalam)',
  bengali: 'বাংলা (Bengali)',
  gujarati: 'ગુજરાતી (Gujarati)',
  marathi: 'मराठी (Marathi)',
  punjabi: 'ਪੰਜਾਬੀ (Punjabi)',
  odia: 'ଓଡ଼ିଆ (Odia)',
};

const LanguageSelector = ({
  currentLanguage,
  translations,
  onLanguageChange,
}: LanguageSelectorProps) => {
  if (translations.length <= 1) {
    return null;
  }

  const currentTranslation = translations.find(
    (t) => t.language === currentLanguage
  );

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select
        value={currentTranslation?.id || ''}
        onValueChange={onLanguageChange}
      >
        <SelectTrigger className="w-[200px] bg-secondary/50">
          <SelectValue placeholder="Select language">
            {currentLanguage
              ? languageLabels[currentLanguage] || currentLanguage
              : 'Select language'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {translations.map((translation) => (
            <SelectItem key={translation.id} value={translation.id}>
              {translation.language
                ? languageLabels[translation.language] || translation.language
                : 'Unknown'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
