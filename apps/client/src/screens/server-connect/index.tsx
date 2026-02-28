import { fetchServerInfo, setServerUrl } from '@/features/app/actions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Group,
  Input
} from '@sharkord/ui';

import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';

const ServerConnect = memo(() => {
  const [connectUrl, setConnectUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const onSave = useCallback(async () => {
    setSaving(true);

    try {
      let serverUrl = connectUrl;
      if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://'))
        serverUrl = `https://${serverUrl}`;

      const url = new URL(serverUrl);
      serverUrl = `${url.protocol}//${url.host}`;

      const serverInfo = await fetchServerInfo(serverUrl);
      if (!serverInfo) throw new Error('Server is not reachable');

      setServerUrl(serverUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save server URL';

      toast.error(message);
      setSaving(false);
    }
  }, [connectUrl]);

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Desktop Setup</CardTitle>
          <CardDescription>
            Enter the Sharkord server URL this desktop client should connect to.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Group label="Server URL">
            <Input
              placeholder="http://localhost:4991"
              value={connectUrl}
              onChange={(event) => setConnectUrl(event.target.value)}
              onEnter={onSave}
              disabled={saving}
            />
          </Group>

          <Button className="w-full" onClick={onSave} disabled={saving}>
            Save and Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

export { ServerConnect };
