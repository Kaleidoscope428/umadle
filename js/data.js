export let characters = [];

function toTitleCase(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function normalizeClassicField(rawValue, allowedValues) {
  const raw = String(rawValue || '').trim();
  if (!raw) return '';

  const normalized = raw.toLowerCase().replace(/[,/|]+/g, ' ');
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const tokenSet = new Set(tokens);

  const matched = allowedValues.filter(value => tokenSet.has(value.toLowerCase()));
  if (matched.length > 0) return matched.join(', ');

  return toTitleCase(raw);
}

function normalizeEmojiList(rawEmoji) {
  const parts = String(rawEmoji || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 4) return parts.slice(0, 4);
  if (parts.length > 0) return [...parts, '🐎', '🥇', '✨'].slice(0, 4);
  return ['❓', '🐎', '🥇', '✨'];
}

try {
  // Fetch from the newly created database file
  const response = await fetch('./database/umamusume.json');
  if (!response.ok) throw new Error('Failed to fetch JSON');
  const rawData = await response.json();
  
  characters = rawData.map((c) => {
    return {
      id: c.name_en_internal || String(c.id),
      name: c.name_en || c.name_jp,
      icon: c.thumb_img,
      // Use real classic puzzle data from JSON.
      track: normalizeClassicField(c.track, ['Turf', 'Dirt']),
      distance: normalizeClassicField(c.distance, ['Sprint', 'Mile', 'Medium', 'Long']),
      style: normalizeClassicField(c.style, ['Front', 'Pace', 'Late', 'End']),
      ear: normalizeClassicField(c.ears, ['Left', 'Right']),
      height: c.height || 160,
      quote: c.quotes || c.profile || '...',
      emojis: normalizeEmojiList(c.emoji),
      splash: c.sns_header || c.thumb_img
    };
  });
} catch (error) {
  console.warn("Failed to load /database/umamusume.json. Using fallback mock data.", error);
  // Fallback data if JSON fails to load
  characters = [
    {
      id: 'smart_falcon',
      name: 'Smart Falcon',
      icon: 'https://placehold.co/100x100/1e1e24/fff?text=SF',
      track: 'Dirt',
      distance: 'Short, Mile, Middle',
      style: 'Runner',
      ear: 'Right',
      height: 164,
      quote: '"Welcome to Falco\'s live stage!"',
      emojis: ['🎤', '✨', '💖', '🐎'],
      splash: 'https://placehold.co/600x400/1e1e24/fff?text=Smart+Falcon+Splash'
    },
    {
      id: 'agnes_digital',
      name: 'Agnes Digital',
      icon: 'https://placehold.co/100x100/1e1e24/fff?text=AD',
      track: 'Turf, Dirt',
      distance: 'Mile, Middle',
      style: 'Leader, Betweener',
      ear: 'Right',
      height: 143,
      quote: '"I must witness all the precious horse girls!"',
      emojis: ['📸', '😍', '🏃‍♀️', '🏇'],
      splash: 'https://placehold.co/600x400/1e1e24/fff?text=Agnes+Digital+Splash'
    }
  ];
}
