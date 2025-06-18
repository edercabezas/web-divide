export function getPrerenderParams(): { groupID: string }[] {
  return [
    { groupID: 'general' },
    { groupID: 'support' },
    { groupID: 'development' },
  ];
}