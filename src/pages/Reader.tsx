import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
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
}

const Reader = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScripture = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('scriptures')
        .select('id, title, title_hindi, pdf_url, total_chapters')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching scripture:', error);
      } else {
        setScripture(data);
      }
      setLoading(false);
    };

    fetchScripture();
  }, [id]);

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

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/scripture/${id}`)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-lg font-semibold">{scripture.title}</h1>
                {scripture.title_hindi && (
                  <p className="text-sm text-muted-foreground font-devanagari">
                    {scripture.title_hindi}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={zoomIn} disabled={scale >= 2.5}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-muted/30 py-6">
          <div className="container mx-auto flex justify-center">
            {pdfError ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">{pdfError}</p>
                <Button asChild>
                  <Link to={`/scripture/${id}`}>Back to Details</Link>
                </Button>
              </div>
            ) : (
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
                  scale={scale}
                  className="shadow-2xl rounded-lg overflow-hidden"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        {numPages > 0 && (
          <div className="sticky bottom-0 glass-card border-t border-border/50 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= numPages) {
                      setPageNumber(val);
                    }
                  }}
                  className="w-16 text-center bg-background border border-border rounded-md px-2 py-1 text-sm"
                />
                <span className="text-sm text-muted-foreground">of {numPages}</span>
              </div>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reader;
