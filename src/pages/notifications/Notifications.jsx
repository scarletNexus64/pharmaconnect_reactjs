import React, { useState, useEffect } from 'react';
import {
  Bell, AlertTriangle, Info, CheckCircle, Clock,
  ChevronRight, Filter, Check, X, Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterRead, setFilterRead] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on utilise des données mockées
      // Plus tard, on utilisera: const response = await apiService.getNotifications();
      const mockNotifications = [
        {
          id: 1,
          type: 'ALERT',
          severity: 'CRITICAL',
          title: 'Rupture de stock',
          message: 'Le stock de Paracétamol 500mg est épuisé à CS Bangangté',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'INFO',
          severity: 'INFO',
          title: 'Nouvelle livraison',
          message: 'Une nouvelle livraison de 15 médicaments a été reçue',
          is_read: false,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: 'WARNING',
          severity: 'WARNING',
          title: 'Expiration proche',
          message: 'Le lot A123 d\'Artémether expire dans 30 jours',
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          type: 'SUCCESS',
          severity: 'INFO',
          title: 'Dispensation complétée',
          message: 'La dispensation #456 pour le patient Jean Dupont a été complétée',
          is_read: true,
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          type: 'ALERT',
          severity: 'WARNING',
          title: 'Stock faible',
          message: 'Le stock de Quinine injectable est inférieur au seuil minimum',
          is_read: false,
          created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // TODO: await apiService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: await apiService.markAllNotificationsAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      return;
    }

    try {
      // TODO: await apiService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesType = !filterType || notif.type === filterType;
    const matchesRead = !filterRead ||
      (filterRead === 'read' && notif.is_read) ||
      (filterRead === 'unread' && !notif.is_read);

    return matchesType && matchesRead;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    critical: notifications.filter(n => n.severity === 'CRITICAL').length,
    warning: notifications.filter(n => n.severity === 'WARNING').length
  };

  const getNotificationIcon = (type, severity) => {
    if (severity === 'CRITICAL') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (severity === 'WARNING') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    if (type === 'SUCCESS') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getNotificationColor = (severity) => {
    if (severity === 'CRITICAL') return 'border-l-4 border-l-red-500 bg-red-50';
    if (severity === 'WARNING') return 'border-l-4 border-l-yellow-500 bg-yellow-50';
    return 'border-l-4 border-l-blue-500 bg-blue-50';
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Il y a quelques minutes';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">Notifications</span>
        </nav>

        {/* Page Title and Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Gérez et consultez toutes vos notifications système.
            </p>
          </div>
          {stats.unread > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Tout marquer comme lu</span>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Non lues</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critiques</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avertissements</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.warning}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="ALERT">Alertes</option>
                <option value="WARNING">Avertissements</option>
                <option value="INFO">Informations</option>
                <option value="SUCCESS">Succès</option>
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`overflow-hidden ${getNotificationColor(notification.severity)} ${
                !notification.is_read ? 'shadow-md' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-base font-semibold ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(notification.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Marquer comme lu"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )) : (
            <Card className="p-12">
              <div className="text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-500">
                  {filterType || filterRead
                    ? 'Aucune notification ne correspond à vos filtres.'
                    : 'Vous n\'avez aucune notification pour le moment.'}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Notifications;
