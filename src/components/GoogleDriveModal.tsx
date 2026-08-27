import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  UploadCloud,
  FileText,
  FolderPlus,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  Download,
  LogOut,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Product, Order } from '../types';
import {
  signInWithGoogleDrive,
  logoutGoogleDrive,
  listDriveFiles,
  uploadFileToDrive,
  getOrCreateFolder,
  deleteDriveFile,
  getAccessToken,
  initAuth,
  DriveFile
} from '../services/googleDrive';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders?: Order[];
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  products,
  orders = []
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Confirmation dialog state for destructive operations (Mandatory by Workspace Integration Guidelines)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when authenticated and modal opens
  useEffect(() => {
    if (isOpen && hasToken) {
      loadFiles();
    }
  }, [isOpen, hasToken]);

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    setActionStatus(null);
    try {
      const driveFiles = await listDriveFiles(searchQuery);
      setFiles(driveFiles);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء جلب الملفات';
      setActionStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setActionStatus(null);
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        setCurrentUser(res.user);
        setHasToken(true);
        setActionStatus({ type: 'success', message: 'تم ربط حساب Google Drive بنجاح!' });
        loadFiles();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'فشل تسجيل الدخول بحساب Google';
      setActionStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogleDrive();
    setCurrentUser(null);
    setHasToken(false);
    setFiles([]);
    setActionStatus({ type: 'success', message: 'تم تسجيل الخروج بنجاح.' });
  };

  // Backup Products to Google Drive
  const handleBackupProducts = async () => {
    setIsUploading(true);
    setActionStatus(null);
    try {
      const folderId = await getOrCreateFolder('m&l Care Store Backups');
      const fileName = `ml-care-products-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const content = JSON.stringify(
        {
          storeName: 'm&l Care Store',
          exportDate: new Date().toISOString(),
          totalProducts: products.length,
          products
        },
        null,
        2
      );

      const uploaded = await uploadFileToDrive(fileName, content, 'application/json', folderId);
      setActionStatus({
        type: 'success',
        message: `تم رفع نسخة المنتجات الاحتياطية (${uploaded.name}) بنجاح إلى مجلد m&l Care Store في Google Drive! ☁️`
      });
      loadFiles();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'فشل رفع النسخة الاحتياطية';
      setActionStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsUploading(false);
    }
  };

  // Backup Orders to Google Drive
  const handleBackupOrders = async () => {
    setIsUploading(true);
    setActionStatus(null);
    try {
      const folderId = await getOrCreateFolder('m&l Care Store Backups');
      const fileName = `ml-care-orders-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const content = JSON.stringify(
        {
          storeName: 'm&l Care Store',
          exportDate: new Date().toISOString(),
          totalOrders: orders.length,
          orders
        },
        null,
        2
      );

      const uploaded = await uploadFileToDrive(fileName, content, 'application/json', folderId);
      setActionStatus({
        type: 'success',
        message: `تم رفع سجل الطلبات (${uploaded.name}) إلى Google Drive بنجاح!`
      });
      loadFiles();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'فشل رفع سجل الطلبات';
      setActionStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsUploading(false);
    }
  };

  // Execute Destructive Delete after user confirmation
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setActionStatus({
        type: 'success',
        message: `تم حذف الملف "${fileToDelete.name}" من Google Drive بنجاح.`
      });
      setFileToDelete(null);
      loadFiles();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'فشل حذف الملف';
      setActionStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs text-right animate-in fade-in duration-200">
      <div
        id="google-drive-modal-card"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                Google Drive والتخزين السحابي
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  Workspace
                </span>
              </h2>
              <p className="text-xs text-stone-500">حفظ النسخ الاحتياطية وإدارة ملفات المتجر سحابياً</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-stone-200/60 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Status notification */}
          {actionStatus && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border animate-in slide-in-from-top-2 ${
                actionStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {actionStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              <span>{actionStatus.message}</span>
            </div>
          )}

          {/* Authentication State Card */}
          {!hasToken ? (
            <div className="p-8 rounded-3xl border border-stone-200 bg-stone-50/50 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                <HardDrive className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-black text-stone-900">ربط المتجر بحساب Google Drive الخاص بك</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  يتيح لك الربط السحابي حفظ نسخ احتياطية دورية للمنتجات، واستعادة البيانات، وإدارة مستندات وفواتير المتجر بأمان على Google Drive.
                </p>
              </div>

              {/* Official Google Sign-In Button Style */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-stone-300 text-stone-700 font-bold text-sm shadow-xs hover:bg-stone-50 hover:border-stone-400 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'جارِ الربط السحابي...' : 'تسجيل الدخول والربط مع Google Drive'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Account Bar */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-10 h-10 rounded-full border border-amber-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 font-black flex items-center justify-center">
                      {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <span>{currentUser?.displayName || 'حساب Google متصل'}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono">{currentUser?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>فصل الحساب</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions / Backup Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-amber-600" />
                  <span>النسخ الاحتياطي السحابي السريع (Cloud Backup)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleBackupProducts}
                    disabled={isUploading}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-all text-right group flex items-start gap-3 cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-black text-stone-900">نسخ المنتجات إلى Google Drive</div>
                      <div className="text-[11px] text-stone-500">
                        تصدير وحفظ جميع المنتجات ({products.length} منتج) بملف JSON فوري في مجلد m&l.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleBackupOrders}
                    disabled={isUploading}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-all text-right group flex items-start gap-3 cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-black text-stone-900">نسخ سجل الطلبات والمبيعات</div>
                      <div className="text-[11px] text-stone-500">
                        أرشفة ومزامنة بيانات جميع الطلبات المسجلة سحابياً لحمايتها.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Drive File Explorer Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-stone-600" />
                    <span>ملفات Google Drive الأخيرة</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="بحث في Drive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadFiles()}
                        className="w-40 sm:w-52 pr-8 pl-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <button
                      onClick={loadFiles}
                      disabled={isLoadingFiles}
                      className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 cursor-pointer disabled:opacity-50"
                      title="تحديث القائمة"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* File List Table / Items */}
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                  {isLoadingFiles ? (
                    <div className="p-8 text-center space-y-2 text-stone-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                      <div className="text-xs font-bold">جارِ تحميل ملفات Google Drive...</div>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="p-8 text-center space-y-2 text-stone-400">
                      <FolderPlus className="w-8 h-8 mx-auto text-stone-300" />
                      <div className="text-xs font-bold text-stone-600">لا توجد ملفات حالياً</div>
                      <div className="text-[11px] text-stone-400">
                        قم بالضغط على أحد أزرار النسخ الاحتياطي بالأعلى لإنشاء أول ملف في Drive
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="p-3.5 flex items-center justify-between hover:bg-stone-50/70 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-stone-900 truncate">{file.name}</div>
                              <div className="text-[10px] text-stone-400 flex items-center gap-2">
                                <span>{file.mimeType}</span>
                                {file.modifiedTime && (
                                  <span>• {new Date(file.modifiedTime).toLocaleDateString('ar-EG')}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-amber-700 transition-colors"
                                title="فتح في Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setFileToDelete(file)}
                              className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="حذف من Drive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>اتصال مباشر ومحمي عبر Google OAuth API</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog for Destructive Operations */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-stone-900">تأكيد حذف الملف من Google Drive؟</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف الملف{' '}
                <span className="font-bold text-stone-900">"{fileToDelete.name}"</span>؟ لا يمكن التراجع عن هذه
                العملية.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'جارِ الحذف...' : 'نعم، احذف الملف'}
              </button>
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
