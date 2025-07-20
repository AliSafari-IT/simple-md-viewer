---
title: "Belgian Date Format Test"
description: "Testing Belgian date formatting in front matter"
author: "Ali Safari"
lastModified: "2025-01-20"
locale: "nl-BE"
category: "Test"
---

# Belgian Date Format Test

This document demonstrates Belgian date formatting. The `lastModified` date above should be displayed in Belgian format (Dutch) when you specify `locale: "nl-BE"` in the front matter.

## Supported Belgian Locales

- `nl-BE` - Belgian Dutch
- `fr-BE` - Belgian French  
- `be` - Shorthand for Belgian Dutch
- `belgian` - Shorthand for Belgian Dutch
- `belgium` - Shorthand for Belgian Dutch

## Example Usage

In your YAML front matter, add:

```yaml
lastModified: "2025-01-20"
locale: "nl-BE"
```

The date will be formatted as: **20 januari 2025** (Belgian Dutch format)

With `locale: "fr-BE"` it would show: **20 janvier 2025** (Belgian French format)
