// Description: This variable defines the functions that are used to display a color palette in the chatbot.
export const colorPaletteDefinition = {
  type: "function",
  name: "display_color_palette",
  description: "Call this function when a user asks for a color palette.",
  parameters: {
    type: "object",
    strict: true,
    properties: {
      theme: {
        type: "string",
        description: "Description of the theme for the color scheme.",
      },
      colors: {
        type: "array",
        description: "Array of five hex color codes based on the theme.",
        items: {
          type: "string",
          description: "Hex color code",
        },
      },
    },
    required: ["theme", "colors"],
  },
};

//Description: This variable defines the function that is used to adjust the width of the color palette in the chatbot.
export const colorPaletteWidthUIAdjusterDefinition = {
  type: "function",
  name: "adjust_color_palette_width",
  description:
    "Call this function when a user asks to adjust the width of the color palette.",
  parameters: {
    type: "object",
    strict: true,
    properties: {
      width: {
        type: "number",
        description:
          "New width of the color palette in pixels. Default is 780px",
      },
    },
    required: ["width"],
  },
};

//Description: This variable defines the function that is used to adjust the scroll position of event log in the chatbot. Relative to current position.
export const scrollByEventLogDefinition = {
  type: "function",
  name: "scroll_by_event_log",
  description:
    "Call this function when a user asks to scroll the event log by pixels. Relative to the current scroll position.",
  parameters: {
    type: "object",
    strict: true,
    properties: {
      pixels: {
        type: "number",
        description:
          "Number of pixels to scroll. Positive values will scroll down, negative values will scroll up.",
      },
    },
    required: ["pixels"],
  },
};

//Description: This variable defines the function that is used to scroll the event log to the top in the chatbot.
export const scrollToTopEventLogDefinition = {
  type: "function",
  name: "scroll_to_top_event_log",
  description:
    "Call this function when a user asks to scroll the event log to the top.",
};

//Description: This variable defines the function that is used to scroll the event log to the bottom in the chatbot.
export const scrollToBottomEventLogDefinition = {
  type: "function",
  name: "scroll_to_bottom_event_log",
  description:
    "Call this function when a user asks to scroll the event log to the bottom.",
};

//Description: This variable defines the function that is used to filter the event log by keywords
export const filterEventLogDefinition = {
  type: "function",
  name: "filter_event_log",
  description:
    "Call this function when a user asks to filter the event log by keywords.",
  parameters: {
    type: "object",
    strict: true,
    properties: {
      keywords: {
        type: "array",
        description: "Array of keywords to filter the event log.",
        items: {
          type: "string",
          description: "Keyword to filter the event log.",
        },
      },
    },
    required: ["keywords"],
  },
};
