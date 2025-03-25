import * as monaco from 'https://esm.sh/monaco-editor@0.52.0'

const regex = new RegExp(/{{embed:content_block_pension:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?([a-z0-9_\-\/]*)?}}/, "g")

const contentBlockData = {
    "b979187f-c031-4388-8259-f0e69f089d84": {
      "type": "Pension Rate",
      "details": {
        "name": "Basic state pension",
        "rates": {
          "full-basic-state-pension-amount": {
            "amount": "£169.50"
          }
        }
      }
    },
    "2ee2bd7f-406d-43a5-8321-2712495d4f1d": {
      "type": "Pension Rate",
      "details": {
        "name": "New state pension",
        "rates": {
          "full-new-state-pension-amount": {
            "amount": "£203.85"
          }
        }
      }
    },
    "c3d1ab79-4926-49f1-8cbf-48de201d20fc": {
      "type": "Pension Rate",
      "details": {
        "name": "Pension credit standard minimum guarantee",
        "rates": {
          "single-person-amount": {
            "amount": "£201.05"
          },
          "couple-amount": {
            "amount": "£306.85"
          }
        }
      }
    },
    "d3165213-80a1-44dc-8a3f-9126a371c6a8": {
      "type": "Pension Rate",
      "details": {
        "name": "Attendance Allowance",
        "rates": {
          "higher-rate": {
            "amount": "£101.75"
          },
          "lower-rate": {
            "amount": "£68.10"
          }
        }
      }
    },
    "e34b18a5-1cb1-4ac4-90fe-eb1011d81e35": {
      "type": "Pension Rate",
      "details": {
        "name": "Carer's Allowance",
        "rates": {
          "weekly-amount": {
            "amount": "£76.75"
          }
        }
      }
    },
    "7d99d313-eeac-4dba-a17d-6b0430d0f47a": {
      "type": "Pension Rate",
      "details": {
        "name": "Disability Living Allowance",
        "rates": {
          "highest-rate": {
            "amount": "£101.75"
          },
          "middle-rate": {
            "amount": "£68.10"
          },
          "lowest-rate": {
            "amount": "£26.90"
          }
        }
      }
    },
    "690ac63c-b502-44cd-8235-fe4d98241825": {
      "type": "Pension Rate",
      "details": {
        "name": "Winter Fuel Payment",
        "rates": {
          "born-before-1957-amount": {
            "amount": "£250 to £600"
          }
        }
      }
    },
    "e4836dc8-d45b-4522-ba0d-efb41df49dbf": {
      "type": "Pension Rate",
      "details": {
        "name": "Personal Independence Payment",
        "rates": {
          "daily-living-part": {
            "amount": "£101.75"
          },
          "mobility-part": {
            "amount": "£71.00"
          }
        }
      }
    },
    "8a64b807-66ee-49c7-95d3-b503d91e64b2": {
      "type": "Pension Rate",
      "details": {
        "name": "Industrial Injuries Disablement Benefit",
        "rates": {
          "100-percent-disabled": {
            "amount": "£204.80"
          }
        }
      }
    },
    "b8ee4aa8-8308-474c-94c9-a8c5603fdf91": {
      "type": "Pension Rate",
      "details": {
        "name": "Bereavement Support Payment",
        "rates": {
          "initial-payment": {
            "amount": "£3,500"
          },
          "monthly-payment": {
            "amount": "£350"
          }
        }
      }
    }
  }

monaco.languages.register({ id: "govspeak" });

monaco.languages.setMonarchTokensProvider("govspeak", {
  // escape codes
  control: /[\\`*_\[\]{}()#+\-\.!]/,
  noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
  escapes: /\\(?:@control)/,

  // escape codes for javascript/CSS strings
  jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
  tokenizer: {
    root: [
      // headers (with #)
      [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ['white', 'keyword', 'keyword', 'keyword']],

      // headers (with =)
      [/^\s*(=+|\-+)\s*$/, 'keyword'],

      // headers (with ***)
      [/^\s*((\*[ ]?)+)\s*$/, 'meta.separator'],

      // quote
      [/^\s*>+/, 'comment'],

      // list (starting with * or number)
      [/^\s*([\*\-+:]|\d+\.)\s/, 'keyword'],

      // markup within lines
      { include: '@linecontent' },
    ],
    linecontent: [
      // escapes
			[/&\w+;/, 'string.escape'],
			[/@escapes/, 'escape'],

      // various markup
			[/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
			[/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, 'strong'],
			[/\b_[^_]+_\b/, 'emphasis'],
			[/\*([^\\*]|@escapes)+\*/, 'emphasis'],
			[/`([^\\`]|@escapes)+`/, 'variable'],

			// links
			//[/\{+[^}]+\}+/, 'string.target'],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ['string.link', '', 'string.link']],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],

      // embeds
      [regex, 'embedded']
		],
  }
})

monaco.editor.defineTheme("myCustomTheme", {
	base: "vs", // can also be vs-dark or hc-black
	inherit: true, // can also be false to completely replace the builtin rules
	rules: [
		{
			token: "embedded",
			foreground: "ffa500",
		},
	],
  colors: {
		"editor.foreground": "#000000",
	},
});

monaco.languages.registerInlayHintsProvider('govspeak', {
  provideInlayHints: function (model, range, token) {
      const hints = [];

      for (let lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
          const lineContent = model.getLineContent(lineNumber);
          const matches = lineContent.matchAll(regex) || []

          matches.forEach(function (match) {
              const blockData = contentBlockData[match[1]]
              if (blockData) {
                hints.push({
                  position: new monaco.Position(lineNumber, lineContent.indexOf(match[0]) + match[0].length + 1),
                  label: `: ${blockData.type}`,
                  kind: monaco.languages.InlayHintKind.Type,
                  whitespaceBefore: true,
                });
              }
          })
      }

      return { hints, dispose: () => {} };
  }
});

monaco.languages.registerHoverProvider('govspeak', {
  provideHover: function (model, position) {
    const lineContent = model.getLineContent(position.lineNumber);
    let match;

    while ((match = regex.exec(lineContent)) !== null) {
        const start = match.index + 1;
        const end = start + match[0].length - 1;

        if (position.column >= start && position.column <= end) {
            const blockData = contentBlockData[match[1]]

            if (blockData) {
              let value = blockData.details
              if (match[2]) {
                match[2].split("/").forEach(function(key) {
                  value = value[key]
                })
              } else {
                value = blockData.details.name
              }
              return {
                range: new monaco.Range(position.lineNumber, start, position.lineNumber, end + 1),
                contents: [
                    { value: `**Content block:** ${blockData.type}\n\n${value}` }
                ]
              };
            }
        }
    }

    return null;
  }
})

function getDeepKeys(obj) {
  var keys = [];
  for(var key in obj) {
      keys.push(key);
      if(typeof obj[key] === "object") {
          var subkeys = getDeepKeys(obj[key]);
          keys = keys.concat(subkeys.map(function(subkey) {
              return key + "/" + subkey;
          }));
      }
  }
  return keys;
}

monaco.languages.registerCompletionItemProvider('govspeak', {
  triggerCharacters: ['{', ':', '/'],
  provideCompletionItems: (model, position) => {
    const textBeforeCursor = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    let suggestions = [];

    const validBlockTypes = ["content_block_pension"]

    const re = new RegExp(/({{embed:)([\w]+)?:?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?\/?$/, "g")
    const matches = re.exec(textBeforeCursor)

    if (matches) {
      if (matches[3]) {
         // UUID is included
         const uuid = matches[3]; // Extract uuid
         const validKeys = getDeepKeys(contentBlockData[uuid].details)
         suggestions = validKeys.map(key => ({
           label: key,
           kind: monaco.languages.CompletionItemKind.Value,
           insertText: key,
           detail: `key for ${uuid}`,
         }));
      } else if (matches[2]) {
        // Block type is included
        const embedType = matches[2]; // Extract Block type
        suggestions = Object.keys(contentBlockData).map(uuid => ({
          label: uuid,
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: uuid,
          detail: `UUID for ${embedType}`,
        }));
      } else {
        // Embed is included
        suggestions = validBlockTypes.map(type => ({
          label: type,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: `${type}`,
          detail: `Embed type: ${type}`,
        }));
      }
    }

    return { suggestions };
  },
});

monaco.editor.create(document.getElementById("container"), {
  value: document.querySelector("[data-module='content-block-editor']").value,
  language: "govspeak",
  minimap: { enabled: false },
  lineNumbers: "off",
  fontFamily: "GDS Transport,arial,sans-serif",
  fontSize: 20,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  theme: "myCustomTheme",
  wordWrap: "on",
});
