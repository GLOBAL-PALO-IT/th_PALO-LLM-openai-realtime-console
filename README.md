# PALO IT x OpenAI Realtime Console

A folk from [Original OpenAI Realtime Console](https://github.com/openai/openai-realtime-console) with PALO IT modifications

## Additional Changes from PALO IT

- Added PALO IT logo
- Show output transcription
- Change default instruction to Thai language
- Add push to talk/release button and disable Voice activity detection
- Tools such as color palette, event log filter, and scroll controls
- **NEW**: Dashboard with navigation to different voice agent demonstrations
- **NEW**: Airplane ticket customer support voice agent example

This is an example application showing how to use the [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) with [WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc).

### Pages

The application now includes multiple pages accessible via a dashboard:

1. **Dashboard** (`/`) - Landing page with navigation to different voice agent demonstrations
2. **Realtime Console** (`/console`) - Interactive console with tools for color palette, event log filtering, and real-time voice interaction
3. **Airplane Ticket Support** (`/ticket-support`) - Voice-powered customer support agent for airplane ticket inquiries

## Installation and usage

Before you begin, you'll need an OpenAI API key - [create one in the dashboard here](https://platform.openai.com/settings/api-keys). Create a `.env` file from the example file and set your API key in there:

```bash
cp .env.example .env
```

Running this application locally requires [Node.js](https://nodejs.org/) to be installed. Install dependencies for the application with:

```bash
npm install
```

Start the application server with:

```bash
npm run dev
```

This should start the console application on [http://localhost:3000](http://localhost:3000).

_Note:_ The `server.js` file uses [@fastify/vite](https://fastify-vite.dev/) to build and serve the Astro frontend contained in the `/client` folder. You can find the configuration in the [`vite.config.js` file](./vite.config.js)

## Tools Description

In this PALO IT modification, we added some tools to help users interact with the console application. The tools are accessible via the chat input(text/voice). Below is the list of tools and their descriptions.

### Color Palette

- **display_color_palette**: Call this function when a user asks for a color palette. It requires a `theme` (description of the theme for the color scheme) and `colors` (array of five hex color codes based on the theme).

### Tool Panel Width Adjuster

- **adjust_tool_panel_width**: Call this function when a user asks to adjust the width of the tool panel. It requires a `width` (new width of the tool panel in pixels, default is 780px).

### Event Log Scrolling

- **scroll_by_event_log**: Call this function when a user asks to scroll the event log by pixels. It requires `pixels` (number of pixels to scroll; positive values scroll down, negative values scroll up).
- **scroll_to_top_event_log**: Call this function when a user asks to scroll the event log to the top.
- **scroll_to_bottom_event_log**: Call this function when a user asks to scroll the event log to the bottom.

### Event Log Filtering

- **filter_event_log**: Call this function when a user asks to filter the event log by keywords. It requires `keywords` (array of keywords to filter the event log).

### Toggle Event Log

- **toggle_event_log**: Call this function when a user asks to hide/show the event log.

### Toggle Color Palette

- **toggle_color_palette**: Call this function when a user asks to hide/show the color palette.

## Tools Usage Guideline

Speak to the AI to use the tools, Here are some examples of how to use the tools:

- Ask for color recommendation
- Change the width of the tool panel
- Scroll the event
  log up or down by pixels
- Scroll to the top or bottom of the
  event log
- Filter the event log by keywords
- Toggle the event log visibility
- Toggle the color palette visibility

## License

MIT
