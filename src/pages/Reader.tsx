import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, Lock, Unlock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Scripture {
  id: string;
  title: string;
  title_hindi: string | null;
  pdf_url: string | null;
  total_chapters: number | null;
  category: string | null;
  subcategory: string | null;
}

const Reader = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [scale, setScale] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchScriptureAndProgress = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('scriptures')
        .select('id, title, title_hindi, pdf_url, total_chapters, category, subcategory')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching scripture:', error);
      } else {
        setScripture(data);
        // Set initial zoom based on scripture type and device
        const isUpanishad = data?.subcategory === 'Upanishads' || data?.title?.toLowerCase().includes('upanishad');
        const isMobile = window.innerWidth < 768; // Mobile/Android devices
        
        if (isUpanishad) {
          // Upanishads: higher zoom for readability
          setScale(isMobile ? 1.25 : 1.75);
        } else {
          // Other scriptures: desktop gets higher zoom, mobile gets lower
          setScale(isMobile ? 0.6 : 1.0);
        }
      }

      // Load saved reading progress
      if (user) {
        const { data: progressData } = await supabase
          .from('reading_progress')
          .select('current_chapter')
          .eq('user_id', user.id)
          .eq('scripture_id', id)
          .maybeSingle();

        if (progressData?.current_chapter) {
          setPageNumber(progressData.current_chapter);
          setPageInputValue(String(progressData.current_chapter));
        }
      }

      setLoading(false);
    };

    fetchScriptureAndProgress();
  }, [id, user]);

  useEffect(() => {
    // Save reading progress
    const saveProgress = async () => {
      if (!user || !id || numPages === 0) return;

      const progressPercentage = Math.round((pageNumber / numPages) * 100);
      
      await supabase.from('reading_progress').upsert(
        {
          user_id: user.id,
          scripture_id: id,
          current_chapter: pageNumber,
          current_verse: 1,
          progress_percentage: progressPercentage,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,scripture_id' }
      );
    };

    const debounce = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounce);
  }, [pageNumber, numPages, user, id]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfError('Unable to load PDF. The file may not be available yet.');
  };

  const goToPrevPage = () => {
    const newPage = Math.max(pageNumber - 1, 1);
    setPageNumber(newPage);
    setPageInputValue(String(newPage));
  };
  const goToNextPage = () => {
    const newPage = Math.min(pageNumber + 1, numPages);
    setPageNumber(newPage);
    setPageInputValue(String(newPage));
  };
  const zoomIn = () => setScale((prev) => Math.min((prev ?? 1.0) + 0.25, 2.5));
  const zoomOut = () => setScale((prev) => Math.max((prev ?? 1.0) - 0.25, 0.5));

  const toggleFullscreen = useCallback(() => {
    if (!readerContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      readerContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-3xl om-symbol animate-om-spin text-primary">ॐ</span>
        </div>
      </Layout>
    );
  }

  if (!scripture) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="font-display text-2xl font-bold mb-2">Scripture not found</h1>
          <Button asChild>
            <Link to="/library">Browse Library</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!scripture.pdf_url) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="font-display text-2xl font-bold mb-2">Content Coming Soon</h1>
          <p className="text-muted-foreground mb-4">
            The reading content for "{scripture.title}" is not yet available.
          </p>
          <Button asChild>
            <Link to={`/scripture/${id}`}>Back to Details</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div 
        ref={readerContainerRef} 
        className={`min-h-screen flex flex-col overflow-x-hidden ${isFullscreen ? 'bg-background' : ''}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 glass-card border-b border-border/50 px-2 sm:px-4 py-2 sm:py-3">
          <div className="container mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => navigate(`/scripture/${id}`)}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="font-display text-sm sm:text-lg font-semibold truncate">{scripture.title}</h1>
                {scripture.title_hindi && (
                  <p className="text-xs sm:text-sm text-muted-foreground font-devanagari truncate">
                    {scripture.title_hindi}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={zoomOut} 
                disabled={(scale ?? 1.0) <= 0.5 || isLocked}
                className={`h-8 w-8 sm:h-10 sm:w-10 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground min-w-[2.5rem] sm:min-w-[4rem] text-center">
                {Math.round((scale ?? 1.0) * 100)}%
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={zoomIn} 
                disabled={(scale ?? 1.0) >= 2.5 || isLocked}
                className={`h-8 w-8 sm:h-10 sm:w-10 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullscreen}
                disabled={isLocked}
                className={`hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </Button>
              <div className="w-px h-4 sm:h-6 bg-border mx-0.5 sm:mx-1" />
              <Button 
                variant={isLocked ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setIsLocked(!isLocked)}
                className={`h-8 w-8 sm:h-10 sm:w-10 ${isLocked ? 'bg-primary text-primary-foreground' : ''}`}
                title={isLocked ? 'Unlock controls' : 'Lock controls'}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/30 py-6 flex items-center">
          <div className="container mx-auto flex justify-center items-center min-h-full">
            {pdfError ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">{pdfError}</p>
                <Button asChild>
                  <Link to={`/scripture/${id}`}>Back to Details</Link>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Document
                  file={scripture.pdf_url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center py-16">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale ?? 1.0}
                    className="shadow-2xl rounded-lg overflow-hidden"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
                {/* Watermark */}
                <div className="absolute bottom-4 right-4 pointer-events-none select-none">
                  <span className="text-xs sm:text-sm text-foreground/20 font-display tracking-wide">
                    Sanatan Pustak Sanghralaya
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        {numPages > 0 && (
          <div className="sticky bottom-0 glass-card border-t border-border/50 px-4 py-3">
            <div className="container mx-auto flex items-center justify-center gap-4 sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1 || isLocked}
                className={`${isLocked ? 'opacity-50 cursor-not-allowed' : ''} sm:size-default`}
              >
                <ChevronLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pageInputValue}
                  onChange={(e) => {
                    if (isLocked) return;
                    const inputVal = e.target.value;
                    // Allow empty string or valid numbers only
                    if (inputVal === '' || /^\d+$/.test(inputVal)) {
                      setPageInputValue(inputVal);
                    }
                  }}
                  onBlur={() => {
                    // On blur, validate and set the page number
                    const val = parseInt(pageInputValue);
                    if (!isNaN(val) && val >= 1 && val <= numPages) {
                      setPageNumber(val);
                      setPageInputValue(String(val));
                    } else {
                      // Reset to current page if invalid
                      setPageInputValue(String(pageNumber));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(pageInputValue);
                      if (!isNaN(val) && val >= 1 && val <= numPages) {
                        setPageNumber(val);
                        setPageInputValue(String(val));
                      } else {
                        setPageInputValue(String(pageNumber));
                      }
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  disabled={isLocked}
                  className={`w-12 sm:w-16 text-center bg-background border border-border rounded-md px-2 py-1 text-sm ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <span className="text-xs sm:text-sm text-muted-foreground">of {numPages}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages || isLocked}
                className={`${isLocked ? 'opacity-50 cursor-not-allowed' : ''} sm:size-default`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 sm:ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reader;
