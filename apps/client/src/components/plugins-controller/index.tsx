import { setPluginsLoading } from '@/features/app/actions';
import { useServerUrl } from '@/features/app/hooks';
import {
  processPluginComponents,
  setPluginComponents
} from '@/features/server/plugins/actions';
import { getUrlFromServer } from '@/helpers/get-file-url';
import { memo, useCallback, useEffect } from 'react';

export type TPluginsController = {
  loading: boolean;
};

const PluginsController = memo(() => {
  const serverUrl = useServerUrl();

  const fetchPlugins = useCallback(async () => {
    try {
      const response = await fetch(`${getUrlFromServer()}/plugin-components`);

      if (!response.ok) {
        throw new Error(`Failed to fetch plugins: ${response.statusText}`);
      }

      const pluginIds = (await response.json()) as string[];
      const components = await processPluginComponents(pluginIds);

      setPluginComponents(components);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    } finally {
      setPluginsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!serverUrl)
      return;

    // we need to fetch plugins here before joining the server
    // because there might be slots that need to be rendered in the login screen
    // once you are connected the the data flow is through trpc and not through this controller
    fetchPlugins();
  }, [fetchPlugins, serverUrl]);

  return null;
});

export { PluginsController };
