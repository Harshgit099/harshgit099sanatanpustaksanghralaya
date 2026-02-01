import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleHindi: '',
    description: '',
    descriptionHindi: '',
    category: '',
    subcategory: '',
    author: '',
    language: 'hindi',
    parentScriptureId: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [parentScriptures, setParentScriptures] = useState<Array<{ id: string; title: string }>>([]);

  // Check if user has admin or moderator role
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      const { data, error } = await supabase
        .rpc('is_admin_or_moderator', { _user_id: user.id });

      if (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(data);
    };

    if (!authLoading) {
      checkAuthorization();
    }
  }, [user, authLoading]);

  // Fetch parent scriptures for dropdown
  useEffect(() => {
    const fetchParentScriptures = async () => {
      const { data, error } = await supabase
        .from('scriptures')
        .select('id, title')
        .is('parent_scripture_id', null)
        .order('title');

      if (!error && data) {
        setParentScriptures(data);
      }
    };

    if (isAuthorized) {
      fetchParentScriptures();
    }
  }, [isAuthorized]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error('Title and Category are required');
      return;
    }

    setUploading(true);

    try {
      // Generate a unique filename
      const fileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`;
      
      // Upload PDF to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('scripture-pdfs')
        .upload(fileName, pdfFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('scripture-pdfs')
        .getPublicUrl(fileName);

      // Insert scripture record
      const { error: insertError } = await supabase
        .from('scriptures')
        .insert({
          title: formData.title,
          title_hindi: formData.titleHindi || null,
          description: formData.description || null,
          description_hindi: formData.descriptionHindi || null,
          category: formData.category,
          subcategory: formData.subcategory || null,
          author: formData.author || null,
          language: formData.language,
          pdf_url: urlData.publicUrl,
          parent_scripture_id: formData.parentScriptureId || null,
        });

      if (insertError) {
        throw insertError;
      }

      toast.success('Scripture uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        titleHindi: '',
        description: '',
        descriptionHindi: '',
        category: '',
        subcategory: '',
        author: '',
        language: 'hindi',
        parentScriptureId: '',
      });
      setPdfFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload scripture');
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (authLoading || isAuthorized === null) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Not authorized
  if (!user || !isAuthorized) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Upload and manage scriptures</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (English) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleHindi">Title (Hindi) *</Label>
              <Input
                id="titleHindi"
                value={formData.titleHindi}
                onChange={(e) => setFormData({ ...formData, titleHindi: e.target.value })}
                placeholder="हिंदी शीर्षक"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (English) *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriptionHindi">Description (Hindi) *</Label>
            <Textarea
              id="descriptionHindi"
              value={formData.descriptionHindi}
              onChange={(e) => setFormData({ ...formData, descriptionHindi: e.target.value })}
              placeholder="हिंदी विवरण"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vedas">Vedas</SelectItem>
                  <SelectItem value="Upanishads">Upanishads</SelectItem>
                  <SelectItem value="Puranas">Puranas</SelectItem>
                  <SelectItem value="Itihasa">Itihasa</SelectItem>
                  <SelectItem value="Mantras">Mantras</SelectItem>
                  <SelectItem value="Stotras">Stotras</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g., Upanishads, Mahapurana"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g., Vyasa, Valmiki"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="sanskrit">Sanskrit</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="odiya">Odiya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentScripture">Parent Scripture (Optional)</Label>
            <Select
              value={formData.parentScriptureId || "none"}
              onValueChange={(value) => setFormData({ ...formData, parentScriptureId: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent (if this is a child volume)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top-level scripture)</SelectItem>
                {parentScriptures.map((scripture) => (
                  <SelectItem key={scripture.id} value={scripture.id}>
                    {scripture.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF File *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
              {pdfFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{pdfFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Maximum file size: 50MB</p>
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Scripture
              </>
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Admin;
