import {
  LocalStorageKey,
  removeLocalStorageItem,
  setLocalStorageItem,
  setLocalStorageItemAsJSON,
  setLocalStorageItemBool
} from '@/helpers/storage';
import { isDesktopApp, registerShortcuts } from '@/lib/desktop';
import type { TServerInfo, TShortcut } from '@sharkord/shared';
import { toast } from 'sonner';
import { setInfo } from '../server/actions';
import { store } from '../store';
import { serverUrlSelector, shortcutsSelector } from './selectors';
import { appSliceActions } from './slice';
import type { TMessageJumpToTarget } from '@/types';

export const setAppLoading = (loading: boolean) =>
  store.dispatch(appSliceActions.setAppLoading(loading));

export const setIsAutoConnecting = (isAutoConnecting: boolean) =>
  store.dispatch(appSliceActions.setIsAutoConnecting(isAutoConnecting));

export const setPluginsLoading = (loading: boolean) =>
  store.dispatch(appSliceActions.setLoadingPlugins(loading));

export const fetchServerInfo = async (
  serverUrl?: string
): Promise<TServerInfo | undefined> => {
  try {
    const url = serverUrl ?? serverUrlSelector(store.getState());
    const response = await fetch(`${url}/info`);

    if (!response.ok) {
      throw new Error('Failed to fetch server info');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching server info:', error);
  }
};

export const loadApp = async () => {
  const info = await fetchServerInfo();

  if (!info) {
    console.error('Failed to load server info during app load');
    toast.error('Failed to load server info');
    if (isDesktopApp()) {
      setServerUrl(null);
    }
    return;
  }

  const shortcuts = shortcutsSelector(store.getState());
  if (shortcuts) registerShortcuts(shortcuts);

  setInfo(info);
  setAppLoading(false);
};

export const setModViewOpen = (isOpen: boolean, userId?: number) =>
  store.dispatch(
    appSliceActions.setModViewOpen({
      modViewOpen: isOpen,
      userId
    })
  );

export const openThreadSidebar = (parentMessageId: number, channelId: number) =>
  store.dispatch(
    appSliceActions.setThreadSidebarOpen({
      open: true,
      parentMessageId,
      channelId
    })
  );

export const closeThreadSidebar = () =>
  store.dispatch(
    appSliceActions.setThreadSidebarOpen({
      open: false,
      parentMessageId: undefined,
      channelId: undefined
    })
  );

export const resetApp = () => {
  store.dispatch(
    appSliceActions.setModViewOpen({
      modViewOpen: false,
      userId: undefined
    })
  );
  store.dispatch(
    appSliceActions.setThreadSidebarOpen({
      open: false,
      parentMessageId: undefined,
      channelId: undefined
    })
  );
};

export const setAutoJoinLastChannel = (autoJoin: boolean) => {
  store.dispatch(appSliceActions.setAutoJoinLastChannel(autoJoin));

  setLocalStorageItemBool(LocalStorageKey.AUTO_JOIN_LAST_CHANNEL, autoJoin);
};

export const setDmsOpen = (open: boolean) =>
  store.dispatch(appSliceActions.setDmsOpen(open));

export const setSelectedDmChannelId = (channelId: number | undefined) =>
  store.dispatch(appSliceActions.setSelectedDmChannelId(channelId));

export const setBrowserNotifications = async (enabled: boolean) => {
  if (enabled && 'Notification' in window) {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      toast.error('Notification permission was denied.');

      return;
    }
  }

  store.dispatch(appSliceActions.setBrowserNotifications(enabled));
  setLocalStorageItemBool(LocalStorageKey.BROWSER_NOTIFICATIONS, enabled);
};

export const setBrowserNotificationsForMentions = (enabled: boolean) => {
  store.dispatch(appSliceActions.setBrowserNotificationsForMentions(enabled));
  setLocalStorageItemBool(
    LocalStorageKey.BROWSER_NOTIFICATIONS_FOR_MENTIONS,
    enabled
  );
}

export const setServerUrl = (url: string | null) => {
  store.dispatch(appSliceActions.setServerUrl(url));

  if (url) {
    setLocalStorageItem(LocalStorageKey.SERVER_URL, url);
  } else {
    removeLocalStorageItem(LocalStorageKey.SERVER_URL);
  }
};

export const setBrowserNotificationsForDms = async (enabled: boolean) => {
  if (enabled && 'Notification' in window) {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return;
    }
  }

  store.dispatch(appSliceActions.setBrowserNotificationsForDms(enabled));
  setLocalStorageItemBool(
    LocalStorageKey.BROWSER_NOTIFICATIONS_FOR_DMS,
    enabled
  );
}

export const setShortcuts = (shortcuts: TShortcut[]) => {
  store.dispatch(appSliceActions.setShortcuts(shortcuts));

  setLocalStorageItemAsJSON(LocalStorageKey.SHORTCUTS, shortcuts);

  if (isDesktopApp()) {
    registerShortcuts(shortcuts);
  }
};

export const setMessageJumpTarget = (
  payload: TMessageJumpToTarget | undefined
) => store.dispatch(appSliceActions.setMessageJumpTarget(payload));
