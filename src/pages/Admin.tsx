import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, Shield, AlertCircle, Bell, Trash2, IndianRupee, Check, X, Mail, Pencil, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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

interface PaymentRequest {
  id: string;
  user_id: string;
  email: string;
  upi_id: string;
  amount: number;
  status: string;
  created_at: string;
  verified_at: string | null;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Scripture {
  id: string;
  title: string;
  title_hindi: string | null;
  description: string | null;
  description_hindi: string | null;
  category: string;
  subcategory: string | null;
  author: string | null;
  language: string | null;
  pdf_url: string | null;
  parent_scripture_id: string | null;
  total_chapters: number | null;
  total_verses: number | null;
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
    totalChapters: '',
    totalVerses: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [parentScriptures, setParentScriptures] = useState<Array<{ id: string; title: string }>>([]);
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', type: 'info' });
  const [creatingNotification, setCreatingNotification] = useState(false);

  // Payment states
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

  // Contact messages states
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Scripture management states
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [editingScripture, setEditingScripture] = useState<Scripture | null>(null);
  const [editForm, setEditForm] = useState({
    title: '', titleHindi: '', description: '', descriptionHindi: '',
    category: '', subcategory: '', author: '', language: 'hindi', parentScriptureId: '',
  });
  const [saving, setSaving] = useState(false);

  // Check if user has admin or moderator role
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) { setIsAuthorized(false); return; }
      const { data, error } = await supabase.rpc('is_admin_or_moderator', { _user_id: user.id });
      if (error) { setIsAuthorized(false); return; }
      setIsAuthorized(data);
    };
    if (!authLoading) checkAuthorization();
  }, [user, authLoading]);

  useEffect(() => {
    if (isAuthorized) {
      fetchParentScriptures();
      fetchNotifications();
      fetchPaymentRequests();
      fetchContactMessages();
      fetchScriptures();
    }
  }, [isAuthorized]);

  const fetchParentScriptures = async () => {
    const { data } = await supabase.from('scriptures').select('id, title').is('parent_scripture_id', null).order('title');
    if (data) setParentScriptures(data);
  };

  const fetchScriptures = async () => {
    const { data } = await supabase.from('scriptures').select('id, title, title_hindi, description, description_hindi, category, subcategory, author, language, pdf_url, parent_scripture_id').order('created_at', { ascending: false });
    if (data) setScriptures(data);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (data) setNotifications(data as Notification[]);
  };

  const fetchPaymentRequests = async () => {
    const { data } = await supabase.from('payment_requests').select('*').order('created_at', { ascending: false });
    if (data) setPaymentRequests(data as PaymentRequest[]);
  };

  const fetchContactMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setContactMessages(data as ContactMessage[]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') { toast.error('Please select a PDF file'); return; }
      if (file.size > 50 * 1024 * 1024) { toast.error('File size must be less than 50MB'); return; }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { toast.error('Please select a PDF file'); return; }
    if (!formData.title || !formData.category) { toast.error('Title and Category are required'); return; }
    setUploading(true);
    try {
      const sanitizedName = pdfFile.name.replace(/\s+/g, '-').replace(/[^\w\-\.]/g, '').replace(/--+/g, '-');
      const fileName = `${Date.now()}-${sanitizedName || 'scripture.pdf'}`;
      const { error: uploadError } = await supabase.storage.from('scripture-pdfs').upload(fileName, pdfFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('scripture-pdfs').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('scriptures').insert({
        title: formData.title, title_hindi: formData.titleHindi || null,
        description: formData.description || null, description_hindi: formData.descriptionHindi || null,
        category: formData.category, subcategory: formData.subcategory || null,
        author: formData.author || null, language: formData.language,
        pdf_url: urlData.publicUrl, parent_scripture_id: formData.parentScriptureId || null,
      });
      if (insertError) throw insertError;
      toast.success('Scripture uploaded successfully!');
      setFormData({ title: '', titleHindi: '', description: '', descriptionHindi: '', category: '', subcategory: '', author: '', language: 'hindi', parentScriptureId: '' });
      setPdfFile(null);
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchScriptures();
      fetchParentScriptures();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload scripture');
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (s: Scripture) => {
    setEditingScripture(s);
    setEditForm({
      title: s.title,
      titleHindi: s.title_hindi || '',
      description: s.description || '',
      descriptionHindi: s.description_hindi || '',
      category: s.category,
      subcategory: s.subcategory || '',
      author: s.author || '',
      language: s.language || 'hindi',
      parentScriptureId: s.parent_scripture_id || '',
    });
  };

  const handleEditSave = async () => {
    if (!editingScripture) return;
    if (!editForm.title || !editForm.category) { toast.error('Title and Category are required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('scriptures').update({
        title: editForm.title,
        title_hindi: editForm.titleHindi || null,
        description: editForm.description || null,
        description_hindi: editForm.descriptionHindi || null,
        category: editForm.category,
        subcategory: editForm.subcategory || null,
        author: editForm.author || null,
        language: editForm.language,
        parent_scripture_id: editForm.parentScriptureId || null,
      }).eq('id', editingScripture.id);
      if (error) throw error;
      toast.success('Scripture updated successfully!');
      setEditingScripture(null);
      fetchScriptures();
      fetchParentScriptures();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update scripture');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteScripture = async (id: string) => {
    try {
      const { error } = await supabase.from('scriptures').delete().eq('id', id);
      if (error) throw error;
      toast.success('Scripture deleted successfully!');
      fetchScriptures();
      fetchParentScriptures();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete scripture');
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationForm.title || !notificationForm.message) { toast.error('Title and message are required'); return; }
    setCreatingNotification(true);
    try {
      const { error } = await supabase.from('notifications').insert({ title: notificationForm.title, message: notificationForm.message, type: notificationForm.type });
      if (error) throw error;
      toast.success('Notification created successfully!');
      setNotificationForm({ title: '', message: '', type: 'info' });
      fetchNotifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create notification');
    } finally {
      setCreatingNotification(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete notification');
    }
  };

  const handleVerifyPayment = async (id: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'verified') {
        updateData.verified_at = new Date().toISOString();
        updateData.verified_by = user?.id;
      }
      const { error } = await supabase.from('payment_requests').update(updateData).eq('id', id);
      if (error) throw error;

      // If verified, update the user's profile with subscription dates
      if (newStatus === 'verified') {
        const payment = paymentRequests.find(p => p.id === id);
        if (payment) {
          const subscriptionStart = new Date();
          const subscriptionEnd = new Date();
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              is_subscribed: true,
              subscription_start: subscriptionStart.toISOString(),
              subscription_end: subscriptionEnd.toISOString(),
            } as any)
            .eq('user_id', payment.user_id);

          if (profileError) {
            console.error('Failed to update subscription:', profileError);
            toast.error('Payment verified but failed to activate subscription');
          }
        }
      }

      toast.success(`Payment ${newStatus}`);
      fetchPaymentRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      toast.success('Message deleted');
      fetchContactMessages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete message');
    }
  };

  if (authLoading || isAuthorized === null) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!user || !isAuthorized) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage scriptures, notifications, payments & messages</p>
          </div>
        </div>

        <Tabs defaultValue="scriptures" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="scriptures" className="flex items-center gap-1 text-xs sm:text-sm">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Scriptures</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs sm:text-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1 text-xs sm:text-sm">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
          </TabsList>

          {/* Scriptures Tab */}
          <TabsContent value="scriptures">
            <div className="space-y-6">
              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-foreground flex items-center gap-2"><Upload className="h-5 w-5" />Upload New Scripture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (English) *</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleHindi">Title (Hindi) *</Label>
                    <Input id="titleHindi" value={formData.titleHindi} onChange={(e) => setFormData({ ...formData, titleHindi: e.target.value })} placeholder="हिंदी शीर्षक" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (English) *</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter description" rows={3} className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionHindi">Description (Hindi) *</Label>
                  <Textarea id="descriptionHindi" value={formData.descriptionHindi} onChange={(e) => setFormData({ ...formData, descriptionHindi: e.target.value })} placeholder="हिंदी विवरण" rows={3} className="resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
                    <Input id="subcategory" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} placeholder="e.g., Upanishads, Mahapurana" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="e.g., Vyasa, Valmiki" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                      <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
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
                  <Select value={formData.parentScriptureId || "none"} onValueChange={(value) => setFormData({ ...formData, parentScriptureId: value === "none" ? "" : value })}>
                    <SelectTrigger><SelectValue placeholder="Select parent (if this is a child volume)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top-level scripture)</SelectItem>
                      {parentScriptures.map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-file">PDF File *</Label>
                  <div className="flex items-center gap-4">
                    <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} className="flex-1" />
                    {pdfFile && <div className="flex items-center gap-2 text-sm text-muted-foreground"><FileText className="h-4 w-4" /><span>{pdfFile.name}</span></div>}
                  </div>
                  <p className="text-xs text-muted-foreground">Maximum file size: 50MB</p>
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</> : <><Upload className="h-4 w-4 mr-2" />Upload Scripture</>}
                </Button>
              </form>

              {/* Existing Scriptures List */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5" />Uploaded Scriptures ({scriptures.length})</h3>
                {scriptures.length === 0 ? <p className="text-muted-foreground text-center py-4">No scriptures uploaded yet</p> : (
                  <div className="space-y-3">
                    {scriptures.map((s) => (
                      <div key={s.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">{s.title}</h4>
                          {s.title_hindi && <p className="text-xs text-muted-foreground truncate">{s.title_hindi}</p>}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">{s.category}</span>
                            {s.language && <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground capitalize">{s.language}</span>}
                            {s.parent_scripture_id && <span className="px-2 py-0.5 rounded text-xs bg-accent text-accent-foreground">Child</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditDialog(s)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Scripture</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "<strong>{s.title}</strong>"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteScripture(s.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              <form onSubmit={handleCreateNotification} className="space-y-4 glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-foreground flex items-center gap-2"><Bell className="h-5 w-5" />Create New Notification</h3>
                <div className="space-y-2">
                  <Label htmlFor="notif-title">Title *</Label>
                  <Input id="notif-title" value={notificationForm.title} onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })} placeholder="Notification title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notif-message">Message *</Label>
                  <Textarea id="notif-message" value={notificationForm.message} onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} placeholder="Notification message" rows={3} className="resize-none" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notif-type">Type</Label>
                  <Select value={notificationForm.type} onValueChange={(value) => setNotificationForm({ ...notificationForm, type: value })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={creatingNotification}>
                  {creatingNotification ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating...</> : <><Bell className="h-4 w-4 mr-2" />Create Notification</>}
                </Button>
              </form>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Existing Notifications</h3>
                {notifications.length === 0 ? <p className="text-muted-foreground text-center py-4">No notifications yet</p> : (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${n.type === 'event' ? 'bg-primary/20 text-primary' : n.type === 'update' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : n.type === 'announcement' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>{n.type}</span>
                            {!n.is_active && <span className="px-2 py-0.5 rounded text-xs bg-destructive/20 text-destructive">Inactive</span>}
                          </div>
                          <h4 className="font-medium text-sm text-foreground">{n.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteNotification(n.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><IndianRupee className="h-5 w-5" />Payment Requests</h3>
              {paymentRequests.length === 0 ? <p className="text-muted-foreground text-center py-4">No payment requests yet</p> : (
                <div className="space-y-3">
                  {paymentRequests.map((p) => (
                    <div key={p.id} className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${p.status === 'verified' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : p.status === 'rejected' ? 'bg-destructive/20 text-destructive' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>{p.status}</span>
                        <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{p.email}</span></p>
                        <p><span className="text-muted-foreground">UPI ID:</span> <span className="text-foreground">{p.upi_id}</span></p>
                        <p><span className="text-muted-foreground">Amount:</span> <span className="text-foreground font-medium">₹{p.amount}</span></p>
                      </div>
                      {p.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" onClick={() => handleVerifyPayment(p.id, 'verified')}><Check className="h-4 w-4 mr-1" />Verify</Button>
                          <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleVerifyPayment(p.id, 'rejected')}><X className="h-4 w-4 mr-1" />Reject</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Mail className="h-5 w-5" />Contact Messages</h3>
              {contactMessages.length === 0 ? <p className="text-muted-foreground text-center py-4">No messages yet</p> : (
                <div className="space-y-3">
                  {contactMessages.map((m) => (
                    <div key={m.id} className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground">{m.subject}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteContact(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">From:</span> <span className="text-foreground">{m.name} ({m.email})</span></p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Scripture Dialog */}
      <Dialog open={!!editingScripture} onOpenChange={(open) => !open && setEditingScripture(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Scripture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Title (English) *</Label>
                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Title (Hindi)</Label>
                <Input value={editForm.titleHindi} onChange={(e) => setEditForm({ ...editForm, titleHindi: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description (English)</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="resize-none" />
            </div>
            <div className="space-y-1">
              <Label>Description (Hindi)</Label>
              <Textarea value={editForm.descriptionHindi} onChange={(e) => setEditForm({ ...editForm, descriptionHindi: e.target.value })} rows={2} className="resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Category *</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
              <div className="space-y-1">
                <Label>Subcategory</Label>
                <Input value={editForm.subcategory} onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Author</Label>
                <Input value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Language</Label>
                <Select value={editForm.language} onValueChange={(value) => setEditForm({ ...editForm, language: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="sanskrit">Sanskrit</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="odiya">Odiya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Parent Scripture</Label>
              <Select value={editForm.parentScriptureId || "none"} onValueChange={(value) => setEditForm({ ...editForm, parentScriptureId: value === "none" ? "" : value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top-level)</SelectItem>
                  {parentScriptures.filter(p => p.id !== editingScripture?.id).map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingScripture(null)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
