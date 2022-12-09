import { createSlice } from "@reduxjs/toolkit";

import { TrackObject } from "@service/tracks/types";

export interface PlayerState {
  volume: number;
  volumeSnapshot: number;
  context: {
    type?: string;
    id?: string;
    uri?: string;
    name?: string;
  };
  paused: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeatMode: 0 | 1 | 2; // 0:off, 1:context 2:track
  device: {
    active?: string[];
    local?: string;
    current?: string;
  };
  trackWindow: {
    currentTrack?: TrackObject;
    previousTracks: TrackObject[];
    nextTracks: TrackObject[];
  };
}

const defaultState: PlayerState = {
  volume: 0.5,
  volumeSnapshot: 0.5,
  context: {},
  paused: true,
  position: 0,
  duration: 0,
  shuffle: false,
  repeatMode: 0, // 0:off, 1:context 2:track
  device: {},
  trackWindow: {
    currentTrack: undefined,
    previousTracks: [],
    nextTracks: [],
  },
};
const slice = createSlice({
  name: "player",
  initialState: defaultState,
  reducers: {
    setCurrentDevice: (state, action) => {
      state.device.current = action.payload;
    },
    setLocalDevice: (state, action) => {
      state.device.local = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      state.volumeSnapshot = action.payload;
    },
    setMute: (state, action) => {
      if (action.payload) {
        state.volume = 0;
      } else {
        state.volume = state.volumeSnapshot;
      }
    },
    setCurrentContext: (state, action) => {
      state.context = {
        uri: action.payload.uri,
        type: action.payload.type,
        id: action.payload.id,
        name: action.payload.name
      };
    },
    setCurrentTrack: (state, action) => {
      state.trackWindow.currentTrack = action.payload;
    },
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
    },
    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    incPosition: (state) => {
      state.position = state.position + 1000;
    },
    setPaused: (state, action) => {
      state.paused = action.payload;
    },
  },
});
export const {
  setVolume,
  setMute,
  setCurrentContext,
  setCurrentTrack,
  setShuffle,
  setRepeatMode,
  setPaused,
  setPosition,
  setDuration,
  setLocalDevice,
  setCurrentDevice,
  incPosition,
} = slice.actions;

export default slice.reducer;
