import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, Shield, AlertCircle, Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

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
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info',
  });
  const [creatingNotification, setCreatingNotification] = useState(false);

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
      fetchNotifications();
    }
  }, [isAuthorized]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data as Notification[]);
    }
  };

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
      // Generate a unique filename - sanitize to remove special characters
      // Only keep alphanumeric, hyphens, underscores, and dots
      const sanitizedName = pdfFile.name
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\.]/g, '')
        .replace(/--+/g, '-');
      const fileName = `${Date.now()}-${sanitizedName || 'scripture.pdf'}`;
      
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

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notificationForm.title || !notificationForm.message) {
      toast.error('Title and message are required');
      return;
    }

    setCreatingNotification(true);

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notificationForm.title,
          message: notificationForm.message,
          type: notificationForm.type,
        });

      if (error) throw error;

      toast.success('Notification created successfully!');
      setNotificationForm({ title: '', message: '', type: 'info' });
      fetchNotifications();
    } catch (error: any) {
      console.error('Create notification error:', error);
      toast.error(error.message || 'Failed to create notification');
    } finally {
      setCreatingNotification(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error: any) {
      console.error('Delete notification error:', error);
      toast.error(error.message || 'Failed to delete notification');
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
            <p className="text-muted-foreground">Manage scriptures and notifications</p>
          </div>
        </div>

        <Tabs defaultValue="scriptures" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="scriptures" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Scriptures
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scriptures">
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
                  className="resize-none"
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
                  className="resize-none"
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
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6">
              {/* Create Notification Form */}
              <form onSubmit={handleCreateNotification} className="space-y-4 glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Create New Notification
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="notif-title">Title *</Label>
                  <Input
                    id="notif-title"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    placeholder="Notification title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notif-message">Message *</Label>
                  <Textarea
                    id="notif-message"
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    placeholder="Notification message"
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notif-type">Type</Label>
                  <Select
                    value={notificationForm.type}
                    onValueChange={(value) => setNotificationForm({ ...notificationForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={creatingNotification}>
                  {creatingNotification ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Create Notification
                    </>
                  )}
                </Button>
              </form>

              {/* Existing Notifications */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Existing Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No notifications yet</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              notification.type === 'event' ? 'bg-primary/20 text-primary' :
                              notification.type === 'update' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                              notification.type === 'announcement' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {notification.type}
                            </span>
                            {!notification.is_active && (
                              <span className="px-2 py-0.5 rounded text-xs bg-destructive/20 text-destructive">
                                Inactive
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
