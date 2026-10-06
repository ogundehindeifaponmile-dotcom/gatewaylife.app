// src/lib/presenceService.js
import { supabase } from './supabase';

let presenceChannel = null;

// Track current player's presence on the map
export function trackPlayerPresence(userId, location) {
  if (presenceChannel) {
    presenceChannel.untrack();
  }

  presenceChannel = supabase.channel('gateway-life-map', {
    config: {
      presence: { key: userId },
    },
  });

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      // This triggers automatically when players join/leave/move
      const state = presenceChannel.presenceState();
      const players = Object.values(state).flat();
      
      // Dispatch to global window event for UI components to listen
      window.dispatchEvent(new CustomEvent('player-presence-update', { 
        detail: players 
      }));
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: userId,
          location: location,
          online_at: new Date().toISOString(),
        });
      }
    });

  return presenceChannel;
}

// Update tracked location when player travels
export function updatePlayerLocation(location) {
  if (presenceChannel) {
    presenceChannel.track({
      ...presenceChannel.presenceState()[Object.keys(presenceChannel.presenceState())[0]]?.[0],
      location: location,
      updated_at: new Date().toISOString(),
    });
  }
}

// Cleanup on logout/unmount
export function untrackPlayerPresence() {
  if (presenceChannel) {
    presenceChannel.unsubscribe();
    presenceChannel = null;
  }
}
