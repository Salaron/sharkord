import { serverUrlSelector } from '@/features/app/selectors';
import { store } from '@/features/store';
import type { TFile } from '@sharkord/shared';

const getUrlFromServer = () => {
  return serverUrlSelector(store.getState());
};

const getFileUrl = (file: TFile | undefined | null) => {
  if (!file) return '';

  const url = serverUrlSelector(store.getState());

  let baseUrl = `${url}/public/${file.name}`;

  if (file._accessToken) {
    baseUrl += `?accessToken=${file._accessToken}`;
  }

  return encodeURI(baseUrl);
};

export { getFileUrl, getUrlFromServer };
