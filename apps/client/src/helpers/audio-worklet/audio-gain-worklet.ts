export type TContextWithGain = {
  id: string;
  context: AudioContext;
  gainNode: GainNode;
};

const contexts = new Map<string, TContextWithGain>();

const createGainNode = (inputStream: MediaStream): TContextWithGain => {
  if (contexts.has(inputStream.id)) {
    return contexts.get(inputStream.id)!;
  }

  const context = new window.AudioContext();
  const source = context.createMediaStreamSource(inputStream);

  const gainNode = context.createGain();
  source.connect(gainNode);
  gainNode.connect(context.destination);

  const contextWithGain = {
    id: inputStream.id,
    context,
    gainNode
  };
  contexts.set(inputStream.id, contextWithGain);

  return contextWithGain;
};

const removeGainNode = (id: string) => {
  const contextWithGain = contexts.get(id);

  contextWithGain?.gainNode.disconnect();
  contextWithGain?.context.close();

  contexts.delete(id);
};

export { createGainNode, removeGainNode };
